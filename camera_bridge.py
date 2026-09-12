"""Share one camera stream between MediaPipe, DeepFace, and the p5.js UI.

MediaPipe calculates facial geometry on the main thread. At a slower interval,
a cropped face is sent to a background DeepFace worker for demographic and
emotion predictions. Both outputs are merged into ``live-face-data.json``.
"""

from __future__ import annotations

import argparse
import json
import os
import queue
import threading
import time
from pathlib import Path
from typing import Any

import cv2
import mediapipe as mp
import numpy as np
from deepface import DeepFace


DEFAULT_DEMOGRAPHY: dict[str, Any] = {
    "age": 0,
    "race": {
        "asian": 0.0,
        "indian": 0.0,
        "black": 0.0,
        "white": 0.0,
        "middle eastern": 0.0,
        "latino hispanic": 0.0,
    },
    "gender": {"Man": 0.0, "Woman": 0.0},
    "emotion": {"neutral": 100.0},
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Share one camera between MediaPipe and DeepFace")
    parser.add_argument("--camera", type=int, default=0, help="OpenCV camera index")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).with_name("live-face-data.json"),
        help="JSON file read by sketch.js",
    )
    parser.add_argument(
        "--deepface-interval",
        type=float,
        default=2.5,
        help="Seconds between expensive DeepFace analyses",
    )
    parser.add_argument("--no-preview", action="store_true", help="Do not open the OpenCV preview window")
    return parser.parse_args()


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, float(value)))


def normalize(value: float, low: float, high: float) -> float:
    if high <= low:
        return 0.5
    return clamp((value - low) / (high - low))


def distance(points: np.ndarray, first: int, second: int) -> float:
    return float(np.linalg.norm(points[first, :3] - points[second, :3]))


def calculate_metrics(points: np.ndarray) -> list[float]:
    """Compress MediaPipe landmarks into the 12 values used by sketch.js."""
    face_height = max(distance(points, 10, 152), 1e-6)
    face_width = max(distance(points, 234, 454), 1e-6)
    jaw_width = distance(points, 172, 397)
    eye_gap = distance(points, 133, 362)
    left_eye_width = distance(points, 33, 133)
    right_eye_width = distance(points, 362, 263)
    eye_width = max((left_eye_width + right_eye_width) * 0.5, 1e-6)
    left_eye_open = distance(points, 159, 145)
    right_eye_open = distance(points, 386, 374)
    brow_gap = (distance(points, 105, 159) + distance(points, 334, 386)) * 0.5
    nose_length = distance(points, 168, 1)
    nose_width = distance(points, 98, 327)
    mouth_width = distance(points, 61, 291)
    lower_face = distance(points, 1, 152)

    mid_x = (points[1, 0] + points[168, 0] + points[152, 0]) / 3.0
    symmetric_pairs = [(33, 263), (61, 291), (98, 327), (234, 454), (172, 397)]
    asymmetries = []
    for left, right in symmetric_pairs:
        left_distance = abs(points[left, 0] - mid_x)
        right_distance = abs(points[right, 0] - mid_x)
        denominator = max(left_distance + right_distance, 1e-6)
        asymmetries.append(abs(left_distance - right_distance) / denominator)
    asymmetry = float(np.mean(asymmetries))

    # Normalisation keeps every visual metric within 0..1. These bounds are
    # display constraints, not aesthetic or biological standards.
    return [
        normalize(face_height / face_width, 1.15, 1.72),
        normalize(face_width / max(jaw_width, 1e-6), 1.05, 1.55),
        normalize(eye_gap / face_width, 0.18, 0.36),
        normalize(eye_width / face_width, 0.16, 0.31),
        normalize(((left_eye_open + right_eye_open) * 0.5) / eye_width, 0.17, 0.43),
        normalize(brow_gap / face_height, 0.035, 0.13),
        normalize(nose_length / face_height, 0.16, 0.36),
        normalize(nose_width / face_width, 0.17, 0.34),
        normalize(mouth_width / face_width, 0.27, 0.53),
        normalize(lower_face / face_height, 0.28, 0.53),
        normalize(jaw_width / face_width, 0.54, 0.9),
        normalize(asymmetry, 0.0, 0.16),
    ]


def crop_face(frame: np.ndarray, points: np.ndarray, margin: float = 0.18) -> np.ndarray | None:
    """Crop the tracked face once so DeepFace does not open a second camera."""
    height, width = frame.shape[:2]
    x0 = float(np.min(points[:, 0]))
    x1 = float(np.max(points[:, 0]))
    y0 = float(np.min(points[:, 1]))
    y1 = float(np.max(points[:, 1]))
    box_width = x1 - x0
    box_height = y1 - y0
    x0 -= box_width * margin
    x1 += box_width * margin
    y0 -= box_height * margin
    y1 += box_height * margin
    left = max(0, int(x0 * width))
    right = min(width, int(x1 * width))
    top = max(0, int(y0 * height))
    bottom = min(height, int(y1 * height))
    if right - left < 64 or bottom - top < 64:
        return None
    return frame[top:bottom, left:right].copy()


def json_numbers(mapping: Any) -> dict[str, float]:
    if not isinstance(mapping, dict):
        return {}
    result: dict[str, float] = {}
    for key, value in mapping.items():
        try:
            result[str(key)] = float(value)
        except (TypeError, ValueError):
            continue
    return result


def analyze_demography(face_bgr: np.ndarray) -> dict[str, Any]:
    """Run the slower DeepFace attributes on a prepared OpenCV face crop."""
    result = DeepFace.analyze(
        img_path=face_bgr,
        actions=("age", "gender", "race", "emotion"),
        detector_backend="opencv",
        enforce_detection=False,
        align=True,
        silent=True,
    )
    item = result[0] if isinstance(result, list) else result
    if not isinstance(item, dict):
        return dict(DEFAULT_DEMOGRAPHY)
    return {
        "age": int(round(float(item.get("age", 0)))),
        "race": json_numbers(item.get("race")),
        "gender": json_numbers(item.get("gender")),
        "emotion": json_numbers(item.get("emotion")),
    }


def write_json_atomic(path: Path, payload: dict[str, Any]) -> None:
    """Replace the live JSON atomically so the browser never reads a partial file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    os.replace(temporary, path)


def main() -> None:
    args = parse_args()
    analysis_queue: queue.Queue[tuple[str, np.ndarray] | None] = queue.Queue(maxsize=1)
    result_lock = threading.Lock()
    stop_event = threading.Event()
    latest_demography: dict[str, Any] = dict(DEFAULT_DEMOGRAPHY)
    latest_demography_subject = ""

    def deepface_worker() -> None:
        # DeepFace runs off the capture loop; a one-item queue discards backlog and
        # keeps the browser response tied to the most recent available face.
        nonlocal latest_demography, latest_demography_subject
        while not stop_event.is_set():
            try:
                work = analysis_queue.get(timeout=0.25)
            except queue.Empty:
                continue
            if work is None:
                return
            subject_id, face = work
            try:
                result = analyze_demography(face)
            except Exception as error:  # DeepFace first-run downloads and camera frames can fail independently.
                print(f"DeepFace analysis skipped: {error}")
                continue
            with result_lock:
                latest_demography = result
                latest_demography_subject = subject_id

    worker = threading.Thread(target=deepface_worker, name="deepface-worker", daemon=True)
    worker.start()

    camera = cv2.VideoCapture(args.camera)
    if not camera.isOpened():
        raise RuntimeError(f"Cannot open camera index {args.camera}")

    camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    face_mesh = mp.solutions.face_mesh.FaceMesh(
        static_image_mode=False,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.6,
    )

    smoothed_metrics: np.ndarray | None = None
    last_deepface_request = 0.0
    last_json_write = 0.0
    last_face_seen = 0.0
    subject_counter = 0
    subject_id = f"SUBJECT-LIVE-{subject_counter:03d}"
    had_face = False

    print("Camera bridge running. Press Q in the preview window or Ctrl+C to stop.")

    try:
        while True:
            ok, frame = camera.read()
            if not ok:
                continue

            now = time.monotonic()
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = face_mesh.process(rgb)
            has_face = bool(result.multi_face_landmarks)

            if has_face:
                if not had_face and now - last_face_seen > 1.2:
                    subject_counter += 1
                    subject_id = f"SUBJECT-LIVE-{subject_counter:03d}"
                    smoothed_metrics = None
                had_face = True
                last_face_seen = now

                landmarks = result.multi_face_landmarks[0].landmark
                points = np.array([(landmark.x, landmark.y, landmark.z) for landmark in landmarks], dtype=np.float32)
                raw_metrics = np.asarray(calculate_metrics(points), dtype=np.float32)
                if smoothed_metrics is None:
                    smoothed_metrics = raw_metrics
                else:
                    # Exponential smoothing reduces landmark jitter without freezing
                    # the continuous MediaPipe geometry measurements.
                    smoothed_metrics = smoothed_metrics * 0.82 + raw_metrics * 0.18

                if now - last_deepface_request >= args.deepface_interval and analysis_queue.empty():
                    face = crop_face(frame, points)
                    if face is not None:
                        analysis_queue.put_nowait((subject_id, face))
                        last_deepface_request = now

                if now - last_json_write >= 0.25 and smoothed_metrics is not None:
                    # Demographic output is accepted only when it belongs to the same
                    # subject ID as the current landmark stream.
                    with result_lock:
                        if latest_demography_subject == subject_id:
                            demography = dict(latest_demography)
                        else:
                            demography = dict(DEFAULT_DEMOGRAPHY)
                    payload = {
                        "updatedAt": time.time_ns(),
                        "subjectId": subject_id,
                        "age": demography.get("age", 0),
                        "faceConfidence": 0.98,
                        "race": demography.get("race", {}),
                        "gender": demography.get("gender", {}),
                        "emotion": demography.get("emotion", {}),
                        "metrics": [round(float(value), 6) for value in smoothed_metrics],
                    }
                    write_json_atomic(args.output, payload)
                    last_json_write = now

                if not args.no_preview:
                    height, width = frame.shape[:2]
                    x_values = points[:, 0] * width
                    y_values = points[:, 1] * height
                    left = int(max(0, np.min(x_values)))
                    right = int(min(width - 1, np.max(x_values)))
                    top = int(max(0, np.min(y_values)))
                    bottom = int(min(height - 1, np.max(y_values)))
                    cv2.rectangle(frame, (left, top), (right, bottom), (120, 120, 120), 1)
            else:
                if had_face and now - last_face_seen > 1.2:
                    had_face = False

            if not args.no_preview:
                # Mirror only the preview so interaction feels like a mirror.
                # Both models continue to analyse the unflipped source frame.
                preview_frame = cv2.flip(frame, 1)
                cv2.imshow("Shared camera: MediaPipe + DeepFace", preview_frame)
                if cv2.waitKey(1) & 0xFF in (ord("q"), ord("Q")):
                    break
    except KeyboardInterrupt:
        pass
    finally:
        stop_event.set()
        try:
            analysis_queue.put_nowait(None)
        except queue.Full:
            pass
        worker.join(timeout=2.0)
        face_mesh.close()
        camera.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
