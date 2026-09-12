# Algorithmic Autopsy

**Algorithmic Autopsy** is an interactive installation presented as a form of algorithmic fortune-telling. A webcam image is analysed by MediaPipe and DeepFace, and the resulting facial measurements and demographic predictions are mapped into a unique cybernetic astrolabe. Under selected classifications, the interface issues a fictional “privilege card” based on documented examples of bias in automated systems.

The work treats model predictions as a critical artistic material, not as objective descriptions of a person. Inferred race, gender, age and emotion are uncertain model outputs and must not be treated as biological truth or fair measures of identity.

## Project structure

```text
index.html          Browser entry point and web-font loading
sketch.js           Data state, camera polling and p5.js main loop
astrolabe.js        Astrolabe geometry, animation and interface drawing
card.js              Privilege-card rules, content and drawing
camera_bridge.py     Shared webcam pipeline for MediaPipe and DeepFace
requirements.txt     Reproducible Python dependencies
.vscode/settings.json  Prevents Live Server reloads when JSON changes
```

`live-face-data.json` is generated at runtime and is deliberately excluded from Git because it contains biometric-analysis output.

## Requirements

- Python **3.11**
- A webcam
- A Chromium-based browser
- Internet access on the first run. DeepFace downloads model weights, while p5.js and two Google Fonts are currently loaded from CDNs.

The submitted dependency versions were tested on Apple Silicon macOS with Python 3.11.2. Other platforms may require platform-specific TensorFlow or JAX packages.

## Installation

Clone or download this repository, then open a terminal inside the project folder.

### macOS or Linux

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Windows PowerShell

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

## Run the live installation

Two terminal windows are required.

### Terminal 1 — camera analysis

Activate the virtual environment, then run:

```bash
python camera_bridge.py
```

The camera is opened once by OpenCV. The same frame is shared with MediaPipe and DeepFace, and their results are written to `live-face-data.json`.

To try another camera index:

```bash
python camera_bridge.py --camera 1
```

To run without the camera preview window:

```bash
python camera_bridge.py --no-preview
```

Press `Q` in the preview window, or `Ctrl+C` in the terminal, to stop the camera bridge.

### Terminal 2 — local web server

From the project folder, run:

```bash
python3 -m http.server 8000
```

On Windows, `python -m http.server 8000` can be used instead.

Open:

```text
http://127.0.0.1:8000/index.html
```

Do not open `index.html` directly with a `file://` URL. The browser must fetch the live JSON through the local HTTP server.

## Visual demo without a camera

Only the local web server is needed. Open the page and use:

- `R` or `Space`: generate a random simulated face dataset
- `Left Arrow` / `Right Arrow`: switch between fixed demonstration datasets
- `P`: display a random privilege card for visual testing
- `C`: return to live-camera mode
- `N`: prepare the system to recognise a new face
- `M`: enable or disable motion
- `1` / `2`: switch visual palettes
- `D`: show or hide debug information

## Data pipeline

1. OpenCV captures the webcam once.
2. MediaPipe Face Mesh measures twelve normalised geometric relationships.
3. DeepFace predicts age, gender, race and emotion in a background worker.
4. `camera_bridge.py` combines the two outputs in `live-face-data.json`.
5. `sketch.js` polls that file and locks a stable face sample.
6. `astrolabe.js` maps the data into the visual system.
7. `card.js` evaluates the explicitly authored critical rules and may display a privilege card.

The privilege rules are part of the artwork’s argument. They are not a scientific scoring system and must not be reused to make decisions about people.

## Troubleshooting

### `Cannot open camera index 0`

- Close Zoom, Photo Booth and other applications using the webcam.
- Allow camera access for Terminal or VS Code in the operating-system privacy settings.
- Try `python camera_bridge.py --camera 1`.

### The first analysis is slow

DeepFace downloads model weights on first use. Keep the internet connection active and wait for the download to finish before restarting.

### The page repeatedly reloads

Use `python3 -m http.server 8000` instead of Live Server. The included VS Code setting also tells Live Server to ignore changes to `live-face-data.json`.

### Typeface differences on another computer

The interface requests the local typeface `AIzaozichunfeng` when available. Its font file is not distributed in this repository. If it is not installed, the browser uses the defined fallback font. Add the licensed `.ttf` file beside `index.html` only if its licence permits redistribution.

