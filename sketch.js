/*
 * Dodecagonal Lagrange Classification Astrolabe — application controller
 *
 * This file receives live analysis data, stabilises changes between subjects,
 * maps the data into visual state, and controls the p5.js render loop.
 * Geometry and drawing functions live in astrolabe.js; the critical privilege
 * card system lives in card.js. See index.html for the required load order.
 */

// #region [P00] Input Schema, Visual Mapping and Demo Data

const RACE_ORDER = [
  "asian",
  "indian",
  "black",
  "white",
  "middle eastern",
  "latino hispanic",
];

const METRIC = Object.freeze({
  FACE_ASPECT: 0,
  CHEEK_TO_JAW: 1,
  EYE_GAP: 2,
  EYE_WIDTH: 3,
  EYE_OPEN: 4,
  BROW_GAP: 5,
  NOSE_LENGTH: 6,
  NOSE_WIDTH: 7,
  MOUTH_WIDTH: 8,
  LOWER_FACE: 9,
  JAW_WIDTH: 10,
  ASYMMETRY: 11,
});

// Six paired measurements drive the twelve alternating radii of the perimeter.
// Repeating each measurement on the opposite side preserves a legible structure
// while allowing every analysed face to produce a distinct silhouette.
const OUTER_AXES = [
  METRIC.FACE_ASPECT,
  METRIC.NOSE_LENGTH,
  METRIC.EYE_GAP,
  METRIC.CHEEK_TO_JAW,
  METRIC.JAW_WIDTH,
  METRIC.LOWER_FACE,
];

// Identity change detection uses relatively stable geometry only. Expression-
// sensitive measurements are excluded so that movement does not create a new plate.
const IDENTITY_METRICS = [
  METRIC.FACE_ASPECT,
  METRIC.CHEEK_TO_JAW,
  METRIC.EYE_GAP,
  METRIC.EYE_WIDTH,
  METRIC.NOSE_LENGTH,
  METRIC.NOSE_WIDTH,
  METRIC.LOWER_FACE,
  METRIC.JAW_WIDTH,
];

const PALETTES = {
  reference: {
    background: [1, 1, 1],       // #010101
    redDeep: [104, 17, 7],
    red: [194, 46, 12],
    scanRed: [157, 0, 0],
    copperDark: [166, 57, 18],
    aRingRedBrown: [185, 38, 18],
    copper: [222, 76, 22],
    orange: [248, 99, 24],
    amber: [255, 181, 92],
    frameBronzeDark: [92, 42, 25],
    frameCopperMuted: [190, 88, 43],
    frameAmberMuted: [242, 157, 77],
    frameInnerPaleOrange: [255, 202, 145],
    purpleDeep: [22, 4, 45],     // #16042D
    purple: [53, 20, 76],        // #35144C
    purpleBright: [91, 48, 126],
    centerPurpleSolid: [135, 59, 134],
    centerPurpleDashed: [135, 59, 134],
    centerPurpleIntersection: [240, 193, 254],
    centerOrange: [170, 76, 102],
    wear: 0,
  },
  faded: {
    background: [4, 3, 3],
    redDeep: [85, 27, 15],
    red: [157, 58, 28],
    scanRed: [157, 0, 0],
    copperDark: [137, 65, 31],
    aRingRedBrown: [155, 42, 24],
    copper: [186, 86, 42],
    orange: [220, 111, 53],
    amber: [239, 179, 119],
    frameBronzeDark: [70, 39, 28],
    frameCopperMuted: [151, 79, 48],
    frameAmberMuted: [205, 140, 88],
    frameInnerPaleOrange: [239, 190, 146],
    purpleDeep: [20, 7, 37],
    purple: [48, 25, 63],
    purpleBright: [78, 52, 96],
    centerPurpleSolid: [135, 59, 134],
    centerPurpleDashed: [135, 59, 134],
    centerPurpleIntersection: [240, 193, 254],
    centerOrange: [170, 76, 102],
    wear: 1,
  },
};

const DEFAULT_SIGNAL = {
  subjectId: "SUBJECT-DEMO-01",
  age: 42,
  faceConfidence: 0.98,
  race: {
    asian: 14,
    indian: 6,
    black: 3,
    white: 62,
    "middle eastern": 8,
    "latino hispanic": 7,
  },
  gender: { Man: 72, Woman: 28 },
  emotion: { neutral: 78, happy: 11, sad: 5, angry: 3, surprise: 3 },
  metrics: [0.61, 0.44, 0.53, 0.57, 0.41, 0.48, 0.66, 0.52, 0.59, 0.64, 0.55, 0.18],
};

const DEMO_SIGNALS = [
  DEFAULT_SIGNAL,
  {
    subjectId: "SUBJECT-DEMO-02",
    age: 67,
    faceConfidence: 0.97,
    race: { asian: 5, indian: 8, black: 4, white: 70, "middle eastern": 8, "latino hispanic": 5 },
    gender: { Man: 91, Woman: 9 },
    emotion: { neutral: 86, happy: 3, sad: 5, angry: 4, surprise: 2 },
    metrics: [0.25, 0.82, 0.31, 0.42, 0.22, 0.31, 0.37, 0.61, 0.34, 0.43, 0.92, 0.24],
  },
  {
    subjectId: "SUBJECT-DEMO-03",
    age: 24,
    faceConfidence: 0.96,
    race: { asian: 18, indian: 9, black: 11, white: 38, "middle eastern": 7, "latino hispanic": 17 },
    gender: { Man: 51, Woman: 49 },
    emotion: { neutral: 64, happy: 17, sad: 7, angry: 4, surprise: 8 },
    metrics: [0.91, 0.23, 0.91, 0.67, 0.83, 0.78, 0.71, 0.28, 0.42, 0.86, 0.21, 0.76],
  },
  {
    subjectId: "SUBJECT-DEMO-04",
    age: 43,
    faceConfidence: 0.99,
    race: { asian: 3, indian: 5, black: 72, white: 4, "middle eastern": 4, "latino hispanic": 12 },
    gender: { Man: 12, Woman: 88 },
    emotion: { neutral: 81, happy: 9, sad: 3, angry: 3, surprise: 4 },
    metrics: [0.44, 0.91, 0.62, 0.71, 0.58, 0.39, 0.41, 0.94, 0.81, 0.54, 0.72, 0.46],
  },
  {
    subjectId: "SUBJECT-DEMO-05",
    age: 59,
    faceConfidence: 0.95,
    race: { asian: 79, indian: 3, black: 2, white: 8, "middle eastern": 2, "latino hispanic": 6 },
    gender: { Man: 83, Woman: 17 },
    emotion: { neutral: 89, happy: 4, sad: 3, angry: 1, surprise: 3 },
    metrics: [0.18, 0.52, 0.39, 0.29, 0.19, 0.26, 0.25, 0.67, 0.28, 0.31, 0.46, 0.59],
  },
];

// #endregion [P00]

// #region [P01] Runtime State and Live-Input Stability


let paletteName = "reference";
let showDebug = false;
let demoIndex = 0;
let activeSignal = normalizeSignal(DEFAULT_SIGNAL);
let currentState = deriveState(activeSignal);
let lastJsonStamp = null;
let jsonPollTimer = null;
let motionRevision = 0;
let renderedMotionRevision = -1;
let motionStartedAtSeconds = 0;
let currentMotionFrame = null;
let readoutMarkerPositions = [];
let liveLockState = "waiting"; // waiting | sampling | locked
let stableSamples = [];
let replacementSamples = [];
let consecutiveNoFaceSamples = 0;
let simulationMode = false;
let randomSubjectCounter = 0;
let idleAttractMode = false;
let idleNextPlateAtSeconds = Number.POSITIVE_INFINITY;
let lastFreshLivePayloadAtMillis = Date.now();
let electricFaultFrameState = {
  active: false,
  intensity: 0,
  eventIndex: -1,
  anchorY: 0,
  anchorWeight: 0,
  arcCount: 0,
};
let electricFaultSnapshotCanvas = null;
let electricFaultSnapshotContext = null;
let electricFaultSnapshotKey = "";
let electricFaultSnapshotSlices = [];

const DATA_POLL_MS = 750;

// A face must remain geometrically consistent across several samples before the
// displayed plate changes. This prevents camera noise from regenerating the work.
const REQUIRED_STABLE_SAMPLES = 4;
const REQUIRED_REPLACEMENT_SAMPLES = 4;
const STABLE_SAMPLE_DISTANCE = 0.09;
const NEW_FACE_DISTANCE = 0.14;
const NO_FACE_SAMPLES_TO_RELEASE = 8;

const IDLE_ATTRACT_STYLE = {
  enabled: true,
  staleDataTimeoutSeconds: 6,
  replaceAfterCompletedScans: 2,
};

// #endregion [P01]

// #region [F02] Signal Processing and Camera Bridge

function createRandomSignal() {
  randomSubjectCounter += 1;
  const man = randomRange(4, 96);
  return normalizeSignal({
    subjectId: `RANDOM-${String(randomSubjectCounter).padStart(3, "0")}`,
    age: Math.round(randomRange(18, 82)),
    faceConfidence: randomRange(0.91, 0.995),
    race: randomDistribution(RACE_ORDER),
    gender: { Man: man, Woman: 100 - man },
    emotion: randomDistribution(["neutral", "happy", "sad", "angry", "surprise"]),
    metrics: Array.from({ length: 12 }, () => randomRange(0.08, 0.94)),
  });
}

function scheduleNextIdlePlate() {
  const completedScans = Math.max(
    1,
    Math.round(Number(IDLE_ATTRACT_STYLE.replaceAfterCompletedScans) || 1),
  );
  const initialDelay = Math.max(0, Number(SCREEN_SCAN_LINE_STYLE.initialDelaySeconds) || 0);
  const travel = Math.max(0.1, Number(SCREEN_SCAN_LINE_STYLE.travelSeconds) || 0.1);
  const pause = Math.max(0, Number(SCREEN_SCAN_LINE_STYLE.pauseSeconds) || 0);
  const replacementSeconds = initialDelay
    + completedScans * travel
    + (completedScans - 1) * pause;
  idleNextPlateAtSeconds = millis() * 0.001 + replacementSeconds;
}

function generateIdleAttractPlate() {
  const signal = createRandomSignal();
  activeSignal = normalizeSignal({
    ...signal,
    subjectId: signal.subjectId.replace("RANDOM", "IDLE"),
  });
  currentState = deriveState(activeSignal);
  liveLockState = "waiting";
  stableSamples = [];
  replacementSamples = [];
  window.hidePrivilegeCard?.();
  restartMotionSequence();
  scheduleNextIdlePlate();
}

function enterIdleAttractMode() {
  if (!IDLE_ATTRACT_STYLE.enabled || simulationMode || idleAttractMode) return;
  idleAttractMode = true;
  liveLockState = "waiting";
  stableSamples = [];
  replacementSamples = [];
  window.hidePrivilegeCard?.();
  generateIdleAttractPlate();
}

function exitIdleAttractMode() {
  if (!idleAttractMode) return;
  idleAttractMode = false;
  idleNextPlateAtSeconds = Number.POSITIVE_INFINITY;
  window.hidePrivilegeCard?.();
}

function updateIdleAttractMode() {
  if (
    idleAttractMode
    && !simulationMode
    && millis() * 0.001 >= idleNextPlateAtSeconds
  ) {
    generateIdleAttractPlate();
  }
}

function processUnavailableLiveData() {
  if (simulationMode || idleAttractMode || !IDLE_ATTRACT_STYLE.enabled) return;
  const staleMilliseconds = Math.max(
    250,
    Number(IDLE_ATTRACT_STYLE.staleDataTimeoutSeconds) * 1000 || 2400,
  );
  if (Date.now() - lastFreshLivePayloadAtMillis >= staleMilliseconds) {
    enterIdleAttractMode();
  }
}

function emphasized(value, gain = 1.7) {
  return clamp(0.5 + (clamp(value) - 0.5) * gain);
}

function hash01(text) {
  let hash = 2166136261;
  const source = String(text);
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function normalizeSignal(candidate = {}) {
  // Convert all incoming values to the canonical schema expected by the renderer.
  const metrics = Array.from({ length: 12 }, (_, index) =>
    clamp(candidate.metrics?.[index] ?? DEFAULT_SIGNAL.metrics[index]),
  );
  return {
    subjectId: String(candidate.subjectId || DEFAULT_SIGNAL.subjectId),
    age: Number(candidate.age ?? DEFAULT_SIGNAL.age),
    faceConfidence: clamp(candidate.faceConfidence ?? DEFAULT_SIGNAL.faceConfidence),
    race: { ...DEFAULT_SIGNAL.race, ...(candidate.race || {}) },
    gender: { ...DEFAULT_SIGNAL.gender, ...(candidate.gender || {}) },
    emotion: { ...DEFAULT_SIGNAL.emotion, ...(candidate.emotion || {}) },
    metrics,
  };
}

function deriveState(signal) {
  // Derived values are visual controls, not claims about a person's identity.
  const race = RACE_ORDER.map((key) => probability(signal.race[key]));
  const genderValues = Object.values(signal.gender).map(probability);
  const raceCertainty = Math.max(...race, 0);
  const genderCertainty = Math.max(...genderValues, 0);
  const man = probability(signal.gender.Man ?? signal.gender.man ?? 0);
  const white = probability(signal.race.white ?? 0);
  return {
    metrics: signal.metrics.slice(0, 12),
    race,
    faceConfidence: signal.faceConfidence,
    raceCertainty,
    genderCertainty,
    classificationCertainty: (raceCertainty + genderCertainty) * 0.5,
    privilege: Math.sqrt(white * man),
  };
}

function averageSignals(signals) {
  // Average a short stable window before committing a new plate to the display.
  const count = Math.max(1, signals.length);
  const averageObject = (key, fallback) => {
    const keys = new Set(Object.keys(fallback));
    signals.forEach((signal) => Object.keys(signal[key] || {}).forEach((name) => keys.add(name)));
    return Object.fromEntries(
      [...keys].map((name) => [
        name,
        signals.reduce((sum, signal) => sum + Number(signal[key]?.[name] || 0), 0) / count,
      ]),
    );
  };

  return normalizeSignal({
    subjectId: signals[signals.length - 1]?.subjectId || DEFAULT_SIGNAL.subjectId,
    age: signals.reduce((sum, signal) => sum + signal.age, 0) / count,
    faceConfidence: signals.reduce((sum, signal) => sum + signal.faceConfidence, 0) / count,
    race: averageObject("race", DEFAULT_SIGNAL.race),
    gender: averageObject("gender", DEFAULT_SIGNAL.gender),
    emotion: averageObject("emotion", DEFAULT_SIGNAL.emotion),
    metrics: Array.from({ length: 12 }, (_, index) =>
      signals.reduce((sum, signal) => sum + signal.metrics[index], 0) / count,
    ),
  });
}

function identityDistance(a, b) {
  // Mean absolute distance across the selected stable geometry measurements.
  const geometry = IDENTITY_METRICS.reduce(
    (sum, index) => sum + Math.abs(a.metrics[index] - b.metrics[index]),
    0,
  ) / IDENTITY_METRICS.length;
  return geometry;
}

function payloadHasFace(payload) {
  if (!payload || typeof payload !== "object") return false;
  const flags = [payload.detected, payload.hasFace, payload.faceDetected, payload.face_detected];
  if (flags.some((value) => value === false)) return false;
  const status = String(payload.status || "").toLowerCase().replaceAll("-", "_");
  if (status.includes("no_face") || status.includes("not_detected")) return false;

  const confidence = payload.faceConfidence ?? payload.confidence ?? payload.detectionConfidence;
  if (confidence !== undefined && probability(confidence) < 0.25) return false;
  return Array.isArray(payload.metrics) && payload.metrics.length >= 12;
}

function lockLiveSignal(signal) {
  // A locked signal remains visually unchanged until a different face is confirmed.
  exitIdleAttractMode();
  activeSignal = normalizeSignal(signal);
  currentState = deriveState(activeSignal);
  liveLockState = "locked";
  stableSamples = [];
  replacementSamples = [];
  restartMotionSequence();
}

function addStableSample(signal, replacingCurrentFace) {
  // Reset the candidate window when its samples disagree with one another.
  let samples = replacingCurrentFace ? replacementSamples : stableSamples;
  const reference = samples.length ? averageSignals(samples) : signal;

  if (samples.length && identityDistance(signal, reference) > STABLE_SAMPLE_DISTANCE) {
    samples = [signal];
  } else {
    samples.push(signal);
  }
  const requiredSamples = replacingCurrentFace
    ? REQUIRED_REPLACEMENT_SAMPLES
    : REQUIRED_STABLE_SAMPLES;
  if (samples.length > requiredSamples) samples.shift();

  if (replacingCurrentFace) replacementSamples = samples;
  else stableSamples = samples;

  liveLockState = replacingCurrentFace ? "locked" : "sampling";
  if (samples.length >= requiredSamples) {
    lockLiveSignal(averageSignals(samples));
  }
}

function prepareForNextFace() {
  window.hidePrivilegeCard?.();
  exitIdleAttractMode();
  liveLockState = "waiting";
  stableSamples = [];
  replacementSamples = [];
  consecutiveNoFaceSamples = 0;
  lastFreshLivePayloadAtMillis = Date.now();
}

function processLiveFaceData(payload) {
  // No-face samples release the current subject; live faces enter the stability gate.
  if (!payloadHasFace(payload)) {
    consecutiveNoFaceSamples += 1;
    if (consecutiveNoFaceSamples >= NO_FACE_SAMPLES_TO_RELEASE) enterIdleAttractMode();
    return;
  }

  consecutiveNoFaceSamples = 0;
  lastFreshLivePayloadAtMillis = Date.now();
  exitIdleAttractMode();
  const signal = normalizeSignal(payload);

  if (liveLockState !== "locked") {
    addStableSample(signal, false);
    return;
  }

  const subjectChanged = Boolean(
    signal.subjectId
    && activeSignal.subjectId
    && signal.subjectId !== activeSignal.subjectId,
  );
  if (subjectChanged || identityDistance(signal, activeSignal) >= NEW_FACE_DISTANCE) {
    addStableSample(signal, true);
  } else {
    replacementSamples = [];
    liveLockState = "locked";
  }
}

window.updateFaceData = processLiveFaceData;
window.prepareForNextFace = prepareForNextFace;
window.setAstrolabeStyle = (name) => {
  if (PALETTES[name]) paletteName = name;
};
window.loadAstrolabeDemo = (index) => {
  exitIdleAttractMode();
  simulationMode = true;
  demoIndex = ((Number(index) || 0) % DEMO_SIGNALS.length + DEMO_SIGNALS.length) % DEMO_SIGNALS.length;
  activeSignal = normalizeSignal(DEMO_SIGNALS[demoIndex]);
  currentState = deriveState(activeSignal);
  liveLockState = "locked";
  restartMotionSequence();
};
window.loadRandomAstrolabe = () => {
  exitIdleAttractMode();
  simulationMode = true;
  activeSignal = createRandomSignal();
  currentState = deriveState(activeSignal);
  liveLockState = "locked";
  stableSamples = [];
  replacementSamples = [];
  restartMotionSequence();
};
window.useCameraAstrolabe = () => {
  exitIdleAttractMode();
  simulationMode = false;
  lastJsonStamp = null;
  prepareForNextFace();
  pollFaceData();
};

async function pollFaceData() {
  // camera_bridge.py rewrites this JSON file; the timestamp prevents duplicate work.
  if (simulationMode) return;
  if (window.location.protocol === "file:") return;
  try {
    const response = await fetch(`./live-face-data.json?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      processUnavailableLiveData();
      return;
    }
    const payload = await response.json();
    const stamp = payload.updatedAt || JSON.stringify(payload.metrics || []);
    if (!payloadHasFace(payload)) {
      lastJsonStamp = stamp;
      processLiveFaceData(payload);
      return;
    }
    if (stamp !== lastJsonStamp) {
      lastJsonStamp = stamp;
      processLiveFaceData(payload);
    } else {
      processUnavailableLiveData();
    }
  } catch (_error) {
    processUnavailableLiveData();
  }
}

// #endregion [F02]

// #region [F10] p5 Lifecycle and Draw Order

function getAdaptiveDisplayPixelDensity() {
  // Limit backing-canvas pixels on large exhibition displays to avoid frame drops.
  const cssWidth = Math.max(1, Number(window.innerWidth) || windowWidth || 1);
  const cssHeight = Math.max(1, Number(window.innerHeight) || windowHeight || 1);
  const deviceDensity = Math.max(1, Number(window.devicePixelRatio) || 1);
  const densityAllowedByPixelBudget = Math.sqrt(
    DISPLAY_RENDER_STYLE.maximumBackingPixels / (cssWidth * cssHeight),
  );

  return Math.max(
    1,
    Math.min(
      DISPLAY_RENDER_STYLE.maximumPixelDensity,
      deviceDensity,
      densityAllowedByPixelBudget,
    ),
  );
}

function applyAdaptiveDisplayPixelDensity() {
  const targetDensity = getAdaptiveDisplayPixelDensity();
  if (Math.abs(pixelDensity() - targetDensity) > 0.01) {
    pixelDensity(targetDensity);
  }
}

window.setup = function setup() {
  createCanvas(windowWidth, windowHeight);
  applyAdaptiveDisplayPixelDensity();
  frameRate(60);
  strokeCap(SQUARE);
  strokeJoin(MITER);
  jsonPollTimer = window.setInterval(pollFaceData, DATA_POLL_MS);
  pollFaceData();
};

window.draw = function draw() {
  updateIdleAttractMode();
  const motionNowSeconds = millis() * 0.001;
  const deltaSeconds = Math.min(0.05, deltaTime / 1000);
  updateMotionFrame(motionNowSeconds, deltaSeconds);
  const palette = PALETTES[paletteName];
  const frame = getExhibitionFrame();
  const scale = frame.scale;
  const cx = frame.x + frame.width * 0.5;
  const cy = frame.y
    + frame.height * EXHIBITION_LAYOUT_STYLE.astrolabe.centerYRatio;
  const radius = getConstrainedAstrolabeRadius(frame, cx, cy, scale);
  const outer = buildOuterPoints(cx, cy, radius);
  const derivedLayers = buildDerivedNodeLayers(outer, cx, cy);
  const lagrangeGeometry = buildLagrangeGeometry(derivedLayers.layerB);
  const perimeterAlignmentAngle = getPerimeterGeometryAlignmentAngle(
    lagrangeGeometry,
  );
  const cardAstrolabeData = {
    cx,
    cy,
    radius,
    outer,
    layerA: derivedLayers.layerA,
    layerB: derivedLayers.layerB,
    lagrangeGeometry,
  };

  // Render from back to front. Shared geometry is calculated once above and then
  // reused by the plate, the readouts, and the card snapshot.
  drawBackground(palette, frame, scale, cx, cy, radius);
  withMotionOpacity(currentMotionFrame.layerProgress.center, () => {
    drawInnerField(lagrangeGeometry, cx, cy, scale);
  });
  withMotionOpacity(currentMotionFrame.layerProgress.derived, () => {
    withPerimeterRotation(cx, cy, () => {
      drawDerivedNodeLattice(derivedLayers.layerA, derivedLayers.layerB, scale);
      drawDerivedNodes(
        derivedLayers.layerA,
        derivedLayers.layerB,
        scale,
      );
    }, perimeterAlignmentAngle);
  });
  withMotionOpacity(currentMotionFrame.layerProgress.mainNodes, () => {
    withPerimeterRotation(cx, cy, () => {
      drawLagrangeSystem(
        derivedLayers.layerA,
        derivedLayers.layerB,
        scale,
        lagrangeGeometry,
      );
    }, perimeterAlignmentAngle);
  });
  withMotionOpacity(currentMotionFrame.layerProgress.center, () => {
    drawInnerFieldIntersections(lagrangeGeometry, cx, cy);
  });
  withMotionOpacity(currentMotionFrame.layerProgress.center, () => {
    drawCentralMist(cx, cy, radius);
  });
  withMotionOpacity(currentMotionFrame.layerProgress.center, () => {
    drawClassificationCore(cx, cy, radius * 0.18, scale);
  });
  withMotionOpacity(currentMotionFrame.layerProgress.calibration, () => {
    withPerimeterRotation(cx, cy, () => {
      drawPolygonCalibration(outer, derivedLayers.layerA, cx, cy, scale);
    }, perimeterAlignmentAngle);
  });
  withMotionOpacity(currentMotionFrame.layerProgress.outer, () => {
    withPerimeterRotation(cx, cy, () => {
      drawOuterPlate(outer, cx, cy, scale);
      drawOuterZDecorations(outer, derivedLayers.layerA, cx, cy, scale);
    }, perimeterAlignmentAngle);
  });
  window.capturePrivilegeAstrolabeSource?.({
    frame,
    scale,
    astrolabeData: cardAstrolabeData,
    plateRevision: motionRevision,
    ready: isPrivilegeCardSnapshotReady()
      && liveLockState === "locked"
      && !idleAttractMode,
  });
  // Capture occurs before transient glitch/UI layers, keeping the card fragment clean.
  drawElectricFaultGlitch(frame, scale);
  drawRecognitionReadouts(frame, scale, palette);
  drawScreenScanLine(frame, scale, palette);
  window.drawPrivilegeCard?.({
    frame,
    scale,
    palette,
    signal: activeSignal,
    state: currentState,
    astrolabeData: cardAstrolabeData,
    plateRevision: motionRevision,
  });
  drawScreenDepthFrame(frame, scale, palette);
  drawDebugText();
};

window.windowResized = function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  applyAdaptiveDisplayPixelDensity();
};

window.keyPressed = function keyPressed() {
  // R/Space random plate; arrows demo faces; C camera; N release face; D debug;
  // M motion; P card preview; 1/2 colour palette.
  if (key === " " || key === "r" || key === "R") {
    window.loadRandomAstrolabe();
  } else if (keyCode === RIGHT_ARROW) {
    window.loadAstrolabeDemo(demoIndex + 1);
  } else if (keyCode === LEFT_ARROW) {
    window.loadAstrolabeDemo(demoIndex - 1);
  } else if (key === "c" || key === "C") {
    window.useCameraAstrolabe();
  } else if (key === "1") {
    paletteName = "reference";
  } else if (key === "2") {
    paletteName = "faded";
  } else if (key === "n" || key === "N") {
    prepareForNextFace();
  } else if (key === "d" || key === "D") {
    showDebug = !showDebug;
  } else if (key === "m" || key === "M") {
    MOTION_STYLE.enabled = !MOTION_STYLE.enabled;
    if (MOTION_STYLE.enabled) restartMotionSequence();
  } else if (key === "p" || key === "P") {
    window.showRandomPrivilegeCard?.({
      plateRevision: motionRevision,
    });
  }
};

window.addEventListener("beforeunload", () => {
  if (jsonPollTimer) window.clearInterval(jsonPollTimer);
});

// #endregion [F10]
