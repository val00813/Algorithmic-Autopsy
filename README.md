# Algorithmic Autopsy

**Algorithmic Autopsy** is an interactive visual installation built with p5.js, Python, MediaPipe and DeepFace.

## Description

Algorithmic Autopsy presents facial classification as a kind of algorithmic fortune-telling. A webcam analyses a participant's face and turns facial measurements and machine-generated classifications into a unique cybernetic astrolabe.

The project explores how AI reduces complex and fluid identities to fixed categories. When selected classifications are detected, the system issues a fictional “privilege card” based on documented cases of bias in areas such as employment, healthcare, advertising and finance.

The work does not present race, gender, age or emotion predictions as biological facts. Instead, it uses their uncertainty and bias as critical artistic material. It asks who benefits when social assumptions are presented as objective data.

## Interaction Guide

1. Stand in front of the webcam and allow the system to analyse your face.
2. Observe how your facial data is translated into a unique astrolabe.
3. Change your appearance with stickers, make-up, glasses or a different hairstyle.
4. Compare how the machine changes its classification.
5. If selected conditions are detected, the system may issue a fictional privilege card.

## How to Run

This project requires **Python 3.11**, a webcam and a modern browser.

### 1. Install the Python environment

Open a terminal inside the project folder.

#### macOS or Linux

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

#### Windows PowerShell

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 2. Start the camera analysis

In the first terminal window, run:

```bash
python camera_bridge.py
```

Allow camera permission when prompted. Press **Q** in the camera window, or **Ctrl+C** in the terminal, to stop it.

If the default camera is unavailable, try:

```bash
python camera_bridge.py --camera 1
```

### 3. Start the visual interface

Keep the camera bridge running. Open a second terminal in the same project folder and run:

```bash
python3 -m http.server 8000
```

Then open this address in a browser:

```text
http://127.0.0.1:8000/index.html
```

Do not open `index.html` directly as a local file. The local server is required for the live data connection.

## Tools Used

1. **p5.js** — generative graphics, animation and interface rendering
2. **Python and OpenCV** — webcam capture and data bridge
3. **MediaPipe Face Mesh** — real-time facial landmark tracking
4. **DeepFace** — demographic and facial attribute classification
5. **HTML5 Canvas** — browser-based exhibition display

## Important Note

`live-face-data.json` is generated while the program is running. It contains temporary classifier output and should not be treated as verified personal information.

Model files may be downloaded automatically during the first run, so the initial launch can take longer.

## Author

Jingyao Li
