/*
 * Dodecagonal Lagrange Classification Astrolabe — visual system
 *
 * Normalised facial geometry and classifier probabilities are translated into
 * a layered computational astrolabe. The work borrows the visual grammar of
 * astronomical instruments without claiming to measure objective identity.
 * Parameter groups appear first; reusable geometry and render functions follow.
 */

// #region [P02] Global Rendering and Central Atmosphere

const LINE_WEIGHT_GAIN = 1.48;
const LINE_ALPHA_GAIN = 1.34;
const OUTER_NODE_SCALE = 2.05;



const CENTRAL_MIST_STYLE = {
  radiusRatio: 0.78,
  lineInteraction: {
    blendMode: "color-dodge",
    opacity: 0.38,
  },
  blendMode: "lighter",
  opacity: 0.28,
  stops: [
    { at: 0.00, rgb: [54, 6, 177], opacity: 1.00 },  // rgb(54, 6, 177) 100%
    { at: 0.84, rgb: [68, 34, 92], opacity: 0.10 },  // #44225C 10%
    { at: 1.00, rgb: [68, 34, 92], opacity: 0.00 },
  ],
};

// #endregion [P02]

// #region [P03] Layered Node Appearance


const LARGE_NODE_ORANGE_TO_CORE_RATIO = 1.325;

const OUTER_Z_NODE_STYLE = {
  core: {
    diameter: 2.00,
    glow: {
      rgb: [255, 242, 181],
      opacity: 0.90,
      blur: 10.0,
    },
    stops: [
      { at: 0.00, rgb: [255, 242, 181], opacity: 1.00 },
      { at: 0.65, rgb: [255, 242, 181], opacity: 0.90 },
      { at: 1.00, rgb: [255, 242, 181], opacity: 0.30 },
    ],
  },

  orange: {
    diameter: 3.25,
    glow: {
      rgb: [233, 114, 40],
      opacity: 0.80,
      blur: 15.0,
    },
    stops: [
      { at: 0.00, rgb: [233, 114, 40], opacity: 1.00 },
      { at: 0.47, rgb: [233, 114, 40], opacity: 1.00 },
      { at: 1.00, rgb: [233, 114, 40], opacity: 0.50 },
    ],
  },

  redHalo: {
    diameter: 7.6,
    stops: [
      { at: 0.00, rgb: [129, 30, 11], opacity: 1.00 },
      { at: 0.51, rgb: [129, 30, 11], opacity: 0.40 },
      { at: 0.80, rgb: [129, 30, 11], opacity: 0.01 },
      { at: 1.00, rgb: [129, 30, 11], opacity: 0.00 },
    ],
  },
};

const MAIN_NODE_STYLE = {
  core: {
    diameter: 2.00,
    glow: {
      rgb: [255, 242, 181],
      opacity: 0.92,
      blur: 13.0,
    },
    stops: [
      { at: 0.00, rgb: [255, 242, 181], opacity: 1.00 },
      { at: 0.65, rgb: [255, 242, 181], opacity: 0.90 },
      { at: 1.00, rgb: [255, 242, 181], opacity: 0.30 },
    ],
  },
  orange: {
    diameter: 2.00 * LARGE_NODE_ORANGE_TO_CORE_RATIO,
    glow: {
      rgb: [233, 114, 40],
      opacity: 0.82,
      blur: 20.0,
    },
    stops: [
      { at: 0.00, rgb: [233, 114, 40], opacity: 1.00 },
      { at: 0.47, rgb: [233, 114, 40], opacity: 1.00 },
      { at: 1.00, rgb: [233, 114, 40], opacity: 0.50 },
    ],
  },
  redHalo: {
    diameter: 7.6,
    stops: [
      { at: 0.00, rgb: [129, 30, 11], opacity: 1.00 },
      { at: 0.51, rgb: [129, 30, 11], opacity: 0.40 },
      { at: 0.80, rgb: [129, 30, 11], opacity: 0.01 },
      { at: 1.00, rgb: [129, 30, 11], opacity: 0.00 },
    ],
  },
  response: {
    coreCenterLow: [255, 225, 158],
    coreCenterOpacityLow: 0.82,

    orangeLow: [196, 72, 24],
    orangeOpacityLow: 0.52,

    haloLow: [92, 20, 10],
    haloOpacityLow: 0.34,

    power: 0.85,
  },
};

const MASS_NODE_STYLE = {
  core: {
    diameter: 2.00,
    glow: {
      rgb: [255, 255, 255],
      opacity: 0.92,
      blur: 13.0,
    },
    stops: [
      { at: 0.00, rgb: [255, 255, 255], opacity: 1.00 },
      { at: 0.65, rgb: [255, 242, 181], opacity: 0.90 },
      { at: 1.00, rgb: [255, 242, 181], opacity: 0.30 },
    ],
  },

  orange: {
    diameter: 2.00 * LARGE_NODE_ORANGE_TO_CORE_RATIO,
    glow: {
      rgb: [241, 141, 93],
      opacity: 0.82,
      blur: 20.0,
    },
    stops: [
      { at: 0.00, rgb: [241, 141, 93], opacity: 1.00 },
      { at: 0.47, rgb: [241, 141, 93], opacity: 1.00 },
      { at: 1.00, rgb: [255, 141, 72], opacity: 0.50 },
    ],
  },

  redHalo: {
    diameter: 7.60,
    stops: [
      { at: 0.00, rgb: [191, 54, 64], opacity: 1.00 },
      { at: 1.00, rgb: [129, 30, 11], opacity: 0.00 },
    ],
  },

  // Geometry response: restrained core change and a more expressive outer halo.
  sizeResponse: {
    coreRadiusLow: 6.2,
    coreRadiusHigh: 8.6,
    corePower: 1.00,

    orangeToCoreRatio: LARGE_NODE_ORANGE_TO_CORE_RATIO,

    haloRadiusLow: 18.0,
    haloRadiusHigh: 46.0,
    haloPower: 1.10,
  },

  // Colour response: stronger input values produce brighter layered nodes.
  response: {
    coreCenterLow: [255, 225, 158],
    orangeLow: [196, 72, 24],
    haloLow: [92, 20, 10],

    coreOpacityLow: 0.88,
    coreOpacityHigh: 1.00,
    orangeOpacityLow: 0.52,
    orangeOpacityHigh: 1.00,
    haloOpacityLow: 0.20,
    haloOpacityHigh: 1.00,

    power: 0.85,
  },
};

const HORIZONTAL_NODE_STYLE = {
  core: {
    diameter: 2.00,
    stops: [
      { at: 0.00, rgb: [255, 242, 181], opacity: 1.00 },
      { at: 0.65, rgb: [255, 242, 181], opacity: 0.90 },
      { at: 1.00, rgb: [255, 242, 181], opacity: 0.30 },
    ],
  },
  orange: {
    diameter: 3.25,
    stops: [
      { at: 0.00, rgb: [233, 114, 40], opacity: 1.00 },
      { at: 0.47, rgb: [233, 114, 40], opacity: 1.00 },
      { at: 1.00, rgb: [233, 114, 40], opacity: 0.50 },
    ],
  },
  redHalo: {
    diameter: 7.6,
    stops: [
      { at: 0.00, rgb: [129, 30, 11], opacity: 1.00 },
      { at: 0.51, rgb: [129, 30, 11], opacity: 0.40 },
      { at: 0.80, rgb: [129, 30, 11], opacity: 0.01 },
      { at: 1.00, rgb: [129, 30, 11], opacity: 0.00 },
    ],
  },
};

const CENTER_NODE_STYLE = {
  core: {
    diameter: 2.00,
    stops: [
      { at: 0.00, rgb: [255, 242, 181], opacity: 1.00 },
      { at: 0.65, rgb: [255, 242, 181], opacity: 0.90 },
      { at: 1.00, rgb: [255, 242, 181], opacity: 0.30 },
    ],
  },
  orange: {
    diameter: 3.25,
    stops: [
      { at: 0.00, rgb: [233, 114, 40], opacity: 1.00 },
      { at: 0.47, rgb: [233, 114, 40], opacity: 1.00 },
      { at: 1.00, rgb: [233, 114, 40], opacity: 0.50 },
    ],
  },
  redHalo: {
    diameter: 7.6,
    stops: [
      { at: 0.00, rgb: [129, 30, 11], opacity: 1.00 },
      { at: 0.51, rgb: [129, 30, 11], opacity: 0.40 },
      { at: 0.80, rgb: [129, 30, 11], opacity: 0.01 },
      { at: 1.00, rgb: [129, 30, 11], opacity: 0.00 },
    ],
  },
};

const CORE_ONLY_NODE_STYLE = {
  diameter: 2.00,
  stops: [
    { at: 0.00, rgb: [255, 242, 181], opacity: 1.00 },
    { at: 0.65, rgb: [255, 242, 181], opacity: 0.90 },
    { at: 1.00, rgb: [255, 242, 181], opacity: 0.30 },
  ],
};

// #endregion [P03]

// #region [P04] Perimeter Decoration and Derived A/B Lattices

const OUTER_Z_DECORATION_STYLE = {
  dashedRing: {
    color: "copperDark",
    alpha: 150,
    weight: 0.65,
    diameter: 5.85,
    dashLength: 3.8,
    dashGap: 2.4,
  },
  extensionMark: {
    clearance: 2.95,
    axisLength: 5.5,
    gap: 2.6,
    shortBarHalfLength: 4.2,
    longBarHalfLength: 9.4,
  },
};

const Z_DECORATION_LINE_STYLE = {
  color: "orange",
  alpha: 178,
  weight: 0.64,
};



const DERIVED_LINE_STYLE = {
  aRing: {
    color: "aRingRedBrown",
    alpha: 146,
    weight: 0.72,
  },
  bRing: {
    color: "orange",
    alpha: 150,
    weight: 0.70,
  },
  aToB: {
    color: "copper",
    alpha: 218,
    weight: 1.08,
    neighborKeepRatio: 0.42,
    neighborReveal: {
      start: 0.00,
      end: 0.24,
      stagger: 0.06,
    },
  },
  mainNodeField: {
    color: "copper",
    alpha: 132,
    weight: 0.64,
  },
};

const DERIVED_GEOMETRY_STYLE = {
  curvatureLimit: 0.18,
  slopeLimit: 0.20,
  layerA: {
    radialRatio: 0.79,
    curvatureGain: 0.45,
    tangentGain: 0.36,
    calibrationInsetRatio: 0.06,
  },
  layerB: {
    radialRatio: 0.61,
    curvatureGain: -0.35,
    tangentGain: -0.42,
  },
};

// #endregion [P04]

// #region [P05] Central Classification Structure


const PURPLE_STRUCTURE_STYLE = {
  field: {
    ringCount: {
      minimum: 9,
      maximum: 15,
      power: 1.00,
    },
    solidRingCount: 3,
    innerScale: 0.12,
    outerScale: 1.70,
    horizontalStretch: 1.12,
    uprightGeometry: {
      cornerXRatio: 0.50,
      heightToWidthRatio: 0.72,
    },
    dashLength: 1.80,
    dashGap: 3.0,
    ringFade: {
      innerOpacity: 1.00,
      outerOpacity: 0.18,
      power: 1.00,
    },
    solidRing: {
      color: "centerPurpleSolid",
      alpha: 255,
      weight: 0.88,
      edgeGradient: {
        brightVertexIndices: [0, 1, 3, 4],
        midpointColor: "centerPurpleSolid",
        cornerOpacity: 0.40,
        midpointOpacity: 0.10,
      },
    },
    dashedRing: {
      color: "centerPurpleDashed",
      alpha: 255,
      weight: 0.88,
      edgeGradient: {
        brightVertexIndices: [0, 1, 3, 4],
        midpointColor: "centerPurpleDashed",
        cornerOpacity: 1.00,
        midpointOpacity: 0.30,
      },
    },
    diagonals: {
      vertexIndices: [0, 1, 3, 4],
      color: "centerPurpleDashed",
      alpha: 118,
      weight: 0.80,
      dashLength: 1.50,
      dashGap: 2.80,
      intersection: {
        vertexIndices: [0, 1, 2, 3, 4, 5],
        horizontalVertexIndices: [2, 5],
        horizontalOpacity: 0.45,
        color: "centerPurpleIntersection",
        alpha: 255,
        diameter: 1.05,
      },
      axisWeave: {
        enabled: true,
        color: "centerPurpleDashed",
        alpha: 154,
        weight: 0.46,
        dashLength: 2.50,
        dashGap: 1.80,

        outsideOffset: 4.0,

        fade: {
          innerOpacity: 0.90,
          outerOpacity: 0.22,
          power: 1.00,
        },
      },
    },
    paleReferenceHexagons: {
      count: 3,
      intervalPosition: 0.50,
      color: "centerOrange",
      alpha: 100,
      weight: 0.62,
    },
  },
};

const CLASSIFICATION_CORE_STYLE = {
  polygon: {
    color: "orange",
    alpha: 255,
    weight: 1.15,
  },
  rotation: {
    enabled: true,
    cycleSeconds: 18.0,
    direction: 1,
    axisAngleDegrees: -32,
    axisCycleSeconds: 65.0,
    axisDirection: 1,
    startAngleDegrees: 70,
    perspectiveStrength: 0.24,
  },
};

// #endregion [P05]

// #region [P06] Exhibition Layout, Frame, Background and Readouts


const ASTROLABE_ASPECT_STYLE = {
  horizontalScale: 1.20,
  verticalScale: 0.98,
};

const OUTER_GEOMETRY_STYLE = {
  responseGain: 2.60,

  contrastPower: 0.72,

  minimumRadialScale: 0.62,
  maximumRadialScale: 1.38,
};

const DISPLAY_RENDER_STYLE = {
  maximumPixelDensity: 2,
  maximumBackingPixels: 9000000,
};

const EXHIBITION_LAYOUT_STYLE = {
  aspectWidth: 9,
  aspectHeight: 16,
  astrolabe: {
    centerYRatio: 0.31,
    radiusToFrameWidth: 0.292,
    dynamicFit: {
      expansionStrength: 0.72,
      maximumRadiusToFrameWidth: 0.36,
    },
  },
  readouts: {
    leftRatio: 0.20,
    widthRatio: 0.60,
    firstRowYRatio: 0.655,
    rowGapRatio: 0.045,
  },
};

const SCREEN_DEPTH_FRAME_STYLE = {
  enabled: true,
  opacity: 1.0,
  outerInset: 10,
  contentClearance: 20,
  cornerAngleDegrees: 55,
  blendMode: "source-over",
  plane: {
    outerColor: "frameBronzeDark",
    innerColor: "frameBronzeDark",
    outerAlpha: 120,
    innerAlpha: 0,
  },
  layers: {
    color: "frameCopperMuted",
    outerAlpha: 132,
    topBottom: {
      count: 15,
      depth: 84,
      outerWeight: 2.72,
      innerWeight: 1.34,
      spacingPower: 1.00,
      innerAlpha: 7,
      fadePower: 0.810,
    },
    sides: {
      count: 50,
      depth: 120,
      outerWeight: 0.70,
      innerWeight: 0.54,
      spacingPower: 1.15,
      innerAlpha: 6,
      fadePower: 1.00,
    },
  },
  overlayFrame: {
    inset: 104,
    edge: {
      color: "frameInnerPaleOrange",
      alpha: 150,
      weight: 2.54,
    },
    corner: {
      color: "frameAmberMuted",
      alpha: 148,
      weight: 3.0,
      horizontalLength: 48,
      verticalLength: 68,
      gap: 24,
      glowColor: "frameCopperMuted",
      glowAlpha: 58,
      glowBlur: 5,
    },
  },
  outerBorder: {
    color: "frameAmberMuted",
    alpha: 200,
    weight: 4.18,
    glowColor: "frameCopperMuted",
    glowAlpha: 82,
    glowBlur: 9,
  },
};

const BACKGROUND_STAR_FIELD_STYLE = {
  enabled: true,
  count: 260,
  inset: 18,
  color: [255, 255, 255],
  motion: {
    enabled: true,
    directionDegrees: -12,
    directionJitterDegrees: 14,
    curveAmplitude: [2, 15],
    curveCycleSeconds: [13, 31],
    twinkleAmount: 0.22,
    twinkleCycleSeconds: [2.8, 7.5],
  },
  electricity: {
    enabled: true,
    cycleSeconds: 30,
    eventsPerCycle: 12,
    arcsPerEvent: [2, 5],
    activeSeconds: [0.38, 1.28],
    arcTiming: {
      startSpreadRatio: 0.32,
      durationRatio: [0.58, 0.96],
    },
    timingJitter: 0.68,
    minimumStarAlpha: 82,
    minimumDistance: 18,
    maximumDistance: 280,
    neighborChoices: 4,
    segmentLength: 9,
    jitter: 4.2,
    flickerHz: 24,
    blendMode: "screen",
    coreColor: [255, 226, 245],
    glowColor: [126, 45, 210],
    glowWeightMultiplier: 2.8,
    partialDischarge: {
      chance: 0.34,
      endRatio: [0.46, 0.82],
    },
    endpointPulse: {
      radius: [1.8, 4.8],
      alpha: [72, 218],
    },
    faultGlitch: {
      enabled: true,
      minimumIntensity: 0.10,
      refreshHz: 12,
      performance: {
        snapshotScale: 0.40,
      },
      verticalSpread: 230,
      sliceCount: [2, 6],
      sliceHeight: [3, 16],
      horizontalShift: [3, 22],
      cutoutOpacity: 0.68,
      displacedOpacity: [0.68, 1.00],
      seam: {
        color: [255, 92, 128],
        alpha: 0.34,
        weight: 0.55,
      },
      chromaticEcho: {
        enabled: true,
        offset: [1.5, 5.5],
        opacity: 0.20,
        hueRotateDegrees: 42,
        saturation: 1.85,
      },
    },
    response: {
      weight: [0.22, 0.82],
      alpha: [70, 230],
      glowAlpha: [35, 150],
      glowBlur: [3.5, 10.0],
    },
  },
  far: {
    share: 0.55,
    diameter: [0.92, 2.10],
    alpha: [52, 108],
    speed: [1.0, 3.6],
    glowBlur: 0.5,
    glowAlpha: 10,
  },
  middle: {
    share: 0.31,
    diameter: [1.88, 2.82],
    alpha: [94, 184],
    speed: [4.0, 10.5],
    glowBlur: 2.2,
    glowAlpha: 36,
  },
  near: {
    share: 0.14,
    diameter: [1.85, 5.05],
    alpha: [158, 200],
    speed: [10.0, 24.0],
    glowBlur: 5.2,
    glowAlpha: 72,
  },
};

const DATA_READOUT_STYLE = {
  barHeight: 6,
  outlineWeight: 0.1,
  titleSize: 10,
  categorySize: 8.5,
  valueSize: 11,
  markerWidth: 8,
  markerHeight: 14,
  markerGlow: 13,
  track: { color: "copperDark", alpha: 5 },
  segment: { color: "copper", alpha: 82 },
  outline: { color: "amber", alpha: 212 },
  divider: { color: "copperDark", alpha: 232 },
  label: { color: "orange", alpha: 196 },
  activeLabel: { color: "amber", alpha: 255 },
  marker: { color: "orange", alpha: 255 },
  detectionScale: {
    minimum: 80,
    maximum: 100,
    tickCount: 5,
  },
};

// #endregion [P06]

// #region [P07] Motion and Temporal Effects

const SCREEN_SCAN_LINE_STYLE = {
  enabled: true,
  initialDelaySeconds: 0.6,
  pauseSeconds: 6.5,
  travelSeconds: 7.8,
  color: "scanRed",
  alpha: 218,
  weight: 1.15,
  blendMode: "screen",
  horizontalInset: 0,
  fadeInRatio: 0.055,
  fadeOutRatio: 0.075,
  edgeFadeRatio: 0.035,
  glow: {
    alpha: 190,
    blur: 10,
    widthMultiplier: 1.0,
  },
};



const MOTION_STYLE = {
  enabled: true,
  constructionSeconds: 3.2,
  stages: {
    outer: [0.00, 0.18],
    calibration: [0.08, 0.34],
    derived: [0.20, 0.54],
    mainNodes: [0.38, 0.70],
    center: [0.54, 0.84],
    readouts: [0.70, 1.00],
  },
  perimeterRotation: {
    enabled: true,
    cycleSeconds: 88.0,
    direction: -1,
    startAngleDegrees: 20,
  },
  calibrationEcho: {
    cycleSeconds: 10.8,
    activeRatio: 0.72,
    bandWidth: 0.18,
    falloffPower: 1.65,
    color: "amber",
    alpha: 226,
    weight: 0.88,
    inward: 7.0,
    outward: 6.0,
    guide: {
      color: "orange",
      alpha: 154,
      weight: 0.58,
      dashLength: 5.0,
      dashGap: 4.6,
    },
  },
  purpleWave: {
    construction: {
      seconds: 5.2,
      startDelaySeconds: 0.0,
      stagger: 0.72,
      fadeWidth: 0.22,
    },
    cycleSeconds: 6.8,
    bandWidth: 0.27,
    falloffPower: 1.55,
    minimumMultiplier: 0.28,
    maximumMultiplier: 1.80,
  },
  mainNodePulse: {
    cycleSeconds: 3.8,
    haloAmplitude: 0.18,
    orangeAmplitude: 0.06,
  },
  mistDrift: {
    cycleSeconds: 14.0,
    radiusRatio: 0.012,
  },
  readoutMarker: {
    responseSeconds: 0.72,
    initialPosition: 0.50,
  },
};

// #endregion [P07]

// #region [P08] Lagrange-Inspired Main Geometry


const LAGRANGE_GEOMETRY_STYLE = {
  massInsetRatio: 0.24,
};

const SEMANTIC_NODE_SIZE_STYLE = {
  m1FaceConfidence: { min: 6.0, max: 11.5, power: 1.00 },
  m2ClassificationCertainty: { min: 6.0, max: 11.5, power: 1.00 },
  l3GenderCertainty: { min: 2.2, max: 5.2, power: 0.90 },
  l4Privilege: { min: 4.0, max: 10.5, power: 0.85 },
  l5Rejection: { min: 4.0, max: 10.5, power: 0.85 },
  centerVerdict: { min: 2.0, max: 6.5, power: 0.75 },
};

const MAIN_NODE_FIELD_STYLE = {
  vertical: {
    ringCount: 2,
    solidRingCount: 2,
    firstRadiusMultiplier: 2.30,
    firstRadiusGap: 2.0,
    ringGap: 10.0,
    rayCount: 8,
    rayOvershoot: 70.0,
  },
  horizontal: {
    ringCount: 6,
    solidRingCount: 3,
    firstRadiusMultiplier: 1.55,
    firstRadiusGap: 2.0,
    ringGap: 13.2,
    dashLength: 8.6,
    dashGap: 2.2,
    rayCount: 15,
    straightRayCount: 6,
    rayOvershoot: 60.0,
    ringFade: {
      innerOpacity: 1.00,
      outerOpacity: 0.16,
      power: 1.25,
    },
    neuralTendrils: {
      count: 6,
      nearbyPoolSize: 10,
      excludeVerticalAxisNodes: true,
      strandCount: 2,
      strandSpread: 2.4,
      curveStartRatio: 0.68,
      bendRatio: 0.16,
      randomBendRatio: 0.10,
      color: "red",
      innerAlpha: 92,
      outerAlpha: 48,
      weight: 0.48,
    },
  },
  rays: {
    weightRatio: 0.52,
    innerAlphaRatio: 1.00,
    middleAlphaRatio: 0.25,
    middlePosition: 0.52,
    outerAlphaRatio: 0.00,
  },
};

const LAGRANGE_CONNECTION_STYLE = {
  horizontalAxis: {
    color: "orange",
    alpha: 155,
    weight: 0.92,
  },
  verticalAxis: {
    color: "orange",
    alpha: 155,
    weight: 0.42,
  },
  fourMainNodes: {
    color: "copper",
    alpha: 152,
    weight: 0.95,
  },
};

const HORIZONTAL_RANDOM_POINT_STYLE = {
  minCount: 1,
  maxCount: 4,
  minRadius: 2.75,
  maxRadius: 3.35,
};

// #endregion [P08]

// #region [P09] Curved Perimeter and Calibration Guides


const PERIMETER_CURVE_STYLE = {
  bulge: 0.015,
};

const CALIBRATION_STYLE = {
  frame: {
    ratio: 0.85,
    color: "red",
    alpha: 142,
    weight: 0.74,
  },
  ticks: {
    short: {
      color: "copperDark",
      alpha: 140,
      weight: 0.60,
      inward: 3.9,
      outward: 3.9,
    },
    side: {
      color: "copper",
      alpha: 128,
      weight: 0.53,
      inward: 5.2,
      outward: 3.9,
    },
    center: {
      color: "orange",
      alpha: 128,
      weight: 0.53,
      inward: 10.2,
      outward: 4.8,
    },
  },
  guide: {
    outerRatio: 1.015,

    fadeReach: 0.44,
    edgeOpacity: 0.80,
    shoulderOpacity: 0.13,
    peakOpacity: 1.00,

    side: {
      color: "red",
      alpha: 112,
      weight: 0.44,
      dashLength: 4.0,
      dashGap: 4.6,
    },
    center: {
      color: "orange",
      alpha: 146,
      weight: 0.54,
      dashLength: 7.0,
      dashGap: 4.6,
    },
  },
  crossbar: {
    position: 0.60,
    halfLength: 4.8,
    center: { color: "orange", alpha: 172, weight: 0.54 },
  },
  sideParallelConnector: {
    position: 0.50,
    color: "red",
    alpha: 126,
    weight: 0.52,
  },
};

// #endregion [P09]

// #region [F01] Mathematics, Timing and Motion State


function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function mix(a, b, amount) {
  return a + (b - a) * amount;
}

function smoothstep01(value) {
  const amount = clamp(value);
  return amount * amount * (3 - 2 * amount);
}

function progressBetween(value, start, end) {
  return smoothstep01((value - start) / Math.max(0.0001, end - start));
}

function restartMotionSequence() {
  // A confirmed subject starts a fresh construction sequence and card evaluation.
  motionRevision += 1;
  window.hidePrivilegeCard?.();
}

function updateMotionFrame(nowSeconds, deltaSeconds) {
  // Resolve every layer's reveal progress once, then share it across draw calls.
  if (renderedMotionRevision !== motionRevision) {
    renderedMotionRevision = motionRevision;
    motionStartedAtSeconds = nowSeconds;
  }

  const enabled = MOTION_STYLE.enabled;
  const elapsed = Math.max(0, nowSeconds - motionStartedAtSeconds);
  const constructionProgress = enabled
    ? clamp(elapsed / Math.max(0.1, MOTION_STYLE.constructionSeconds))
    : 1;
  const layerProgress = Object.fromEntries(
    Object.entries(MOTION_STYLE.stages).map(([name, range]) => [
      name,
      progressBetween(constructionProgress, range[0], range[1]),
    ]),
  );

  currentMotionFrame = {
    enabled,
    time: enabled ? nowSeconds : 0,
    deltaSeconds: Math.max(0, Math.min(0.05, deltaSeconds)),
    elapsed,
    constructionProgress,
    layerProgress,
  };
}

function withMotionOpacity(opacity, drawCallback) {
  const context = drawingContext;
  context.save();
  context.globalAlpha *= clamp(opacity);
  drawCallback();
  context.restore();
}

function getPerimeterRotationAngle() {
  const style = MOTION_STYLE.perimeterRotation;
  if (!MOTION_STYLE.enabled || !style.enabled || !currentMotionFrame) {
    return 0;
  }
  return radians(style.startAngleDegrees)
    + currentMotionFrame.elapsed * Math.PI * 2
      / Math.max(0.1, style.cycleSeconds)
      * Math.sign(style.direction || -1);
}

function withPerimeterRotation(cx, cy, drawCallback, alignmentAngle = 0) {
  const angle = getPerimeterRotationAngle() + alignmentAngle;
  if (Math.abs(angle) < 1e-9) {
    drawCallback();
    return;
  }
  const context = drawingContext;
  context.save();
  context.translate(cx, cy);
  context.rotate(angle);
  context.translate(-cx, -cy);
  drawCallback();
  context.restore();
}

function getPerimeterGeometryAlignmentAngle(lagrangeGeometry) {
  const baseAxisAngle = Math.atan2(
    lagrangeGeometry.rightAxisEnd.y - lagrangeGeometry.l3.y,
    lagrangeGeometry.rightAxisEnd.x - lagrangeGeometry.l3.x,
  );
  return -baseAxisAngle;
}

function periodicWave(cycleSeconds, phase = 0) {
  const time = currentMotionFrame?.time ?? 0;
  return 0.5 + 0.5 * Math.sin(
    time * Math.PI * 2 / Math.max(0.1, cycleSeconds) + phase,
  );
}

function purpleConstructionTimeline() {
  if (!currentMotionFrame?.enabled) {
    return { progress: 1, elapsed: Number.POSITIVE_INFINITY, duration: 0 };
  }
  const style = MOTION_STYLE.purpleWave.construction;
  const centerStartRatio = MOTION_STYLE.stages.center?.[0] ?? 0;
  const startAtSeconds = MOTION_STYLE.constructionSeconds * centerStartRatio
    + Math.max(0, style.startDelaySeconds ?? 0);
  const elapsed = Math.max(0, currentMotionFrame.elapsed - startAtSeconds);
  const duration = Math.max(0.1, style.seconds);
  return {
    progress: clamp(elapsed / duration),
    elapsed,
    duration,
  };
}

function purpleRadialWaveMultiplier(ringProgress) {
  if (!currentMotionFrame?.enabled) return 1;
  const construction = purpleConstructionTimeline();
  if (construction.progress < 1) return 1;
  const style = MOTION_STYLE.purpleWave;
  const cycleSeconds = Math.max(0.2, style.cycleSeconds);
  const waveElapsed = Math.max(0, construction.elapsed - construction.duration);
  const cyclePhase = (waveElapsed % cycleSeconds) / cycleSeconds;
  const headPosition = smoothstep01(cyclePhase);
  const position = clamp(ringProgress);
  const distanceFromHead = Math.min(
    Math.abs(position - headPosition),
    Math.abs(position - (headPosition - 1)),
    Math.abs(position - (headPosition + 1)),
  );
  const bandWidth = Math.max(0.025, style.bandWidth);
  const wave = Math.pow(
    Math.max(0, 1 - distanceFromHead / bandWidth),
    Math.max(0.2, style.falloffPower),
  );
  return mix(style.minimumMultiplier, style.maximumMultiplier, wave);
}

function purpleRingConstructionProgress(ringProgress) {
  if (!currentMotionFrame?.enabled) return 1;
  const style = MOTION_STYLE.purpleWave.construction;
  const purpleProgress = purpleConstructionTimeline().progress;
  const start = clamp(ringProgress) * clamp(style.stagger, 0, 0.95);
  const end = Math.min(1, start + Math.max(0.02, style.fadeWidth));
  return progressBetween(purpleProgress, start, end);
}

function purpleRingVisibility(ringProgress, fieldStyle = PURPLE_STRUCTURE_STYLE.field) {
  const fade = fieldStyle.ringFade;
  const staticOpacity = mix(
    fade.innerOpacity,
    fade.outerOpacity,
    Math.pow(clamp(ringProgress), Math.max(0.05, fade.power)),
  );
  return clamp(
    staticOpacity
    * purpleRadialWaveMultiplier(ringProgress)
    * purpleRingConstructionProgress(ringProgress),
  );
}

function positiveAngle(angle) {
  const fullTurn = Math.PI * 2;
  return ((angle % fullTurn) + fullTurn) % fullTurn;
}

function perimeterHorizontalCaptureSeconds() {
  // Find the first frame in which the rotating horizontal axis is level for capture.
  const rotationStyle = MOTION_STYLE.perimeterRotation;
  if (!MOTION_STYLE.enabled || !rotationStyle.enabled) return 0;

  const startAngle = radians(rotationStyle.startAngleDegrees);
  const targetRotationAngle = 0;
  const direction = Math.sign(rotationStyle.direction || -1);
  const cycleSeconds = Math.max(0.1, rotationStyle.cycleSeconds);
  const angularSpeed = Math.PI * 2 / cycleSeconds;
  const angularDistance = direction < 0
    ? positiveAngle(startAngle - targetRotationAngle)
    : positiveAngle(targetRotationAngle - startAngle);
  let captureSeconds = angularDistance / angularSpeed;

  const minimumReadySeconds = Math.max(0, MOTION_STYLE.constructionSeconds);
  if (captureSeconds < minimumReadySeconds) {
    captureSeconds += Math.ceil(
      (minimumReadySeconds - captureSeconds) / cycleSeconds,
    ) * cycleSeconds;
  }
  return captureSeconds;
}

function isPrivilegeCardSnapshotReady() {
  const visualLayersReady = ["outer", "calibration", "derived", "mainNodes", "center"]
    .every((name) => (currentMotionFrame?.layerProgress?.[name] ?? 0) >= 0.999);
  if (!visualLayersReady) return false;
  if (!currentMotionFrame?.enabled) return true;
  return currentMotionFrame.elapsed >= perimeterHorizontalCaptureSeconds();
}

function probability(value) {
  const number = Number(value) || 0;
  return clamp(number > 1 ? number / 100 : number);
}

function randomRange(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

function randomDistribution(keys) {
  const weights = keys.map(() => -Math.log(Math.max(1e-6, Math.random())));
  const total = weights.reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(
    keys.map((name, index) => [name, (weights[index] / total) * 100]),
  );
}

// #endregion [F01]

// #region [F03] Geometry and Stroke Primitives

function rgba(rgb, alpha) {
  return color(rgb[0], rgb[1], rgb[2], alpha);
}

function lineAlpha(alpha) {
  return Math.min(255, alpha * LINE_ALPHA_GAIN);
}

function polarPoint(cx, cy, radius, angle) {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

function scaledPoint(point, cx, cy, scale) {
  return {
    x: mix(cx, point.x, scale),
    y: mix(cy, point.y, scale),
  };
}

function shapeOuterMetric(value) {
  const style = OUTER_GEOMETRY_STYLE;
  const signedDistance = clamp(
    (clamp(value) - 0.5) * 2 * style.responseGain,
    -1,
    1,
  );
  const shapedDistance = Math.sign(signedDistance) * Math.pow(
    Math.abs(signedDistance),
    Math.max(0.01, style.contrastPower),
  );
  return 0.5 + shapedDistance * 0.5;
}

function buildOuterPoints(cx, cy, radius) {
  // Six geometry measurements repeat on opposing axes to form twelve points.
  return Array.from({ length: 12 }, (_, index) => {
    const style = OUTER_GEOMETRY_STYLE;
    const value = shapeOuterMetric(
      currentState.metrics[OUTER_AXES[index % 6]],
    );
    const radialScale = mix(
      style.minimumRadialScale,
      style.maximumRadialScale,
      value,
    );
    const point = polarPoint(
      cx,
      cy,
      radius * radialScale,
      -Math.PI / 2 + index * (Math.PI / 6),
    );
    return {
      x: cx + (point.x - cx) * ASTROLABE_ASPECT_STYLE.horizontalScale,
      y: cy + (point.y - cy) * ASTROLABE_ASPECT_STYLE.verticalScale,
    };
  });
}

function buildClassificationPoints(
  cx,
  cy,
  radius,
  axisAngle = 0,
  turnAngle = 0,
  perspectiveStrength = 0,
) {
  const axisX = Math.cos(axisAngle);
  const axisY = Math.sin(axisAngle);
  const perpendicularX = -axisY;
  const perpendicularY = axisX;
  const turnCosine = Math.cos(turnAngle);
  const turnSine = Math.sin(turnAngle);

  return Array.from({ length: 6 }, (_, index) => {
    const value = Math.sqrt(clamp(currentState.race[index]));
    const basePoint = polarPoint(
      cx,
      cy,
      radius * (0.28 + value * 0.92),
      -Math.PI / 2 + index * (Math.PI / 3),
    );
    const relativeX = basePoint.x - cx;
    const relativeY = basePoint.y - cy;
    const parallelDistance = relativeX * axisX + relativeY * axisY;
    const perpendicularDistance =
      relativeX * perpendicularX + relativeY * perpendicularY;
    const projectedPerpendicular = perpendicularDistance * turnCosine;
    const depth = perpendicularDistance * turnSine;
    const depthRatio = depth / Math.max(0.0001, radius);
    const perspectiveScale = clamp(
      1 / (1 - depthRatio * perspectiveStrength),
      0.65,
      1.55,
    );

    return {
      x: cx + (
        axisX * parallelDistance
        + perpendicularX * projectedPerpendicular
      ) * perspectiveScale,
      y: cy + (
        axisY * parallelDistance
        + perpendicularY * projectedPerpendicular
      ) * perspectiveScale,
      depthRatio,
      perspectiveScale,
    };
  });
}

function drawClosedPath(points, rgb, alpha, weight = 1) {
  noFill();
  stroke(rgba(rgb, lineAlpha(alpha)));
  strokeWeight(weight * LINE_WEIGHT_GAIN);
  beginShape();
  points.forEach((point) => vertex(point.x, point.y));
  endShape(CLOSE);
}

function buildCurvedPolygonEdge(a, b, cx, cy, bulge) {
  const tangentX = b.x - a.x;
  const tangentY = b.y - a.y;
  const length = Math.max(0.0001, Math.hypot(tangentX, tangentY));
  const midpoint = {
    x: (a.x + b.x) * 0.5,
    y: (a.y + b.y) * 0.5,
  };
  let normalX = -tangentY / length;
  let normalY = tangentX / length;
  if (normalX * (midpoint.x - cx) + normalY * (midpoint.y - cy) < 0) {
    normalX *= -1;
    normalY *= -1;
  }
  return {
    a,
    b,
    control: {
      x: midpoint.x + normalX * length * bulge,
      y: midpoint.y + normalY * length * bulge,
    },
  };
}

function quadraticEdgePoint(edge, t) {
  const amount = clamp(t);
  const inverse = 1 - amount;
  return {
    x: inverse * inverse * edge.a.x
      + 2 * inverse * amount * edge.control.x
      + amount * amount * edge.b.x,
    y: inverse * inverse * edge.a.y
      + 2 * inverse * amount * edge.control.y
      + amount * amount * edge.b.y,
  };
}

function quadraticEdgeTangent(edge, t) {
  const amount = clamp(t);
  return {
    x: 2 * (1 - amount) * (edge.control.x - edge.a.x)
      + 2 * amount * (edge.b.x - edge.control.x),
    y: 2 * (1 - amount) * (edge.control.y - edge.a.y)
      + 2 * amount * (edge.b.y - edge.control.y),
  };
}

function curvedEdgeNormal(edge, t, cx, cy) {
  const point = quadraticEdgePoint(edge, t);
  const tangent = quadraticEdgeTangent(edge, t);
  const length = Math.max(0.0001, Math.hypot(tangent.x, tangent.y));
  let x = -tangent.y / length;
  let y = tangent.x / length;
  if (x * (point.x - cx) + y * (point.y - cy) < 0) {
    x *= -1;
    y *= -1;
  }
  return { x, y };
}

function drawCurvedClosedPath(points, cx, cy, bulge, rgb, alpha, weight = 1) {
  if (points.length < 2) return;
  noFill();
  stroke(rgba(rgb, lineAlpha(alpha)));
  strokeWeight(weight * LINE_WEIGHT_GAIN);
  beginShape();
  vertex(points[0].x, points[0].y);
  for (let index = 0; index < points.length; index += 1) {
    const edge = buildCurvedPolygonEdge(
      points[index],
      points[(index + 1) % points.length],
      cx,
      cy,
      bulge,
    );
    quadraticVertex(edge.control.x, edge.control.y, edge.b.x, edge.b.y);
  }
  endShape();
}

function rayCurvedEdgeIntersection(origin, direction, edge, segments = 24) {
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  let previous = quadraticEdgePoint(edge, 0);
  for (let index = 1; index <= segments; index += 1) {
    const current = quadraticEdgePoint(edge, index / segments);
    const intersection = rayLineIntersection(origin, direction, previous, current);
    if (intersection) {
      const distance = Math.hypot(
        intersection.x - origin.x,
        intersection.y - origin.y,
      );
      if (distance < nearestDistance) {
        nearest = intersection;
        nearestDistance = distance;
      }
    }
    previous = current;
  }
  return nearest;
}

function drawDashedPath(
  points,
  closed,
  rgb,
  alpha,
  weight,
  dashLength,
  dashGap,
  scale,
) {
  if (!points.length) return;
  const context = drawingContext;
  context.save();
  context.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(lineAlpha(alpha) / 255)})`;
  context.lineWidth = Math.max(0.35, weight * LINE_WEIGHT_GAIN);
  context.lineCap = "butt";
  context.lineJoin = "miter";
  context.setLineDash([
    Math.max(0.1, dashLength * scale),
    Math.max(0.1, dashGap * scale),
  ]);
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index].x, points[index].y);
  }
  if (closed) context.closePath();
  context.stroke();
  context.restore();
}

function drawVertexFocusedGradientRing(
  points,
  palette,
  ringStyle,
  alpha,
  dashed,
  dashLength,
  dashGap,
  scale,
) {
  if (points.length < 2) return;
  const gradientStyle = ringStyle.edgeGradient;
  const brightRgb = palette[ringStyle.color];
  const midpointRgb = palette[gradientStyle.midpointColor];
  const brightVertices = new Set(gradientStyle.brightVertexIndices);
  const baseOpacity = clamp(lineAlpha(alpha) / 255);
  const cornerOpacity = clamp(gradientStyle.cornerOpacity);
  const midpointOpacity = clamp(gradientStyle.midpointOpacity);
  const cssColor = (rgb, opacity) =>
    `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(opacity)})`;
  const context = drawingContext;

  context.save();
  context.lineWidth = Math.max(
    0.35,
    ringStyle.weight * scale * LINE_WEIGHT_GAIN,
  );
  context.lineCap = "butt";
  context.lineJoin = "miter";
  context.setLineDash(dashed
    ? [
      Math.max(0.1, dashLength * scale),
      Math.max(0.1, dashGap * scale),
    ]
    : []);
  context.lineDashOffset = 0;

  for (let index = 0; index < points.length; index += 1) {
    const nextIndex = (index + 1) % points.length;
    const start = points[index];
    const end = points[nextIndex];
    const startIsBright = brightVertices.has(index);
    const endIsBright = brightVertices.has(nextIndex);
    const edgeGradient = context.createLinearGradient(
      start.x,
      start.y,
      end.x,
      end.y,
    );

    edgeGradient.addColorStop(
      0,
      cssColor(
        startIsBright ? brightRgb : midpointRgb,
        baseOpacity * (startIsBright ? cornerOpacity : midpointOpacity),
      ),
    );
    edgeGradient.addColorStop(
      0.5,
      cssColor(midpointRgb, baseOpacity * midpointOpacity),
    );
    edgeGradient.addColorStop(
      1,
      cssColor(
        endIsBright ? brightRgb : midpointRgb,
        baseOpacity * (endIsBright ? cornerOpacity : midpointOpacity),
      ),
    );

    context.strokeStyle = edgeGradient;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }
  context.restore();
}

function drawOpenLine(a, b, rgb, alpha, weight = 1) {
  stroke(rgba(rgb, lineAlpha(alpha)));
  strokeWeight(weight * LINE_WEIGHT_GAIN);
  line(a.x, a.y, b.x, b.y);
}

// #endregion [F03]

// #region [F04] Background, Perimeter and Calibration Rendering

function starRandom01(index, channel) {
  let value = (
    Math.imul(index + 1, 0x9e3779b1)
    + Math.imul(channel + 1, 0x85ebca6b)
    + 0x243f6a88
  ) | 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d);
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b);
  value ^= value >>> 16;
  return (value >>> 0) / 4294967296;
}

function drawBackgroundElectricArc(
  start,
  end,
  scale,
  time,
  burstIndex,
  arcIndex,
  burstOpacity,
  arcStrength,
  style,
  context,
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 0.001) return;

  const seedBase = burstIndex * 100003 + arcIndex * 1009;
  const partialStyle = style.partialDischarge;
  const isPartial = partialStyle
    && starRandom01(seedBase, 31) < clamp(partialStyle.chance);
  const completion = isPartial
    ? mix(
      partialStyle.endRatio[0],
      partialStyle.endRatio[1],
      starRandom01(seedBase, 32),
    )
    : 1;
  const pathDistance = distance * completion;

  const segmentCount = Math.max(
    4,
    Math.ceil(pathDistance / Math.max(2, style.segmentLength * scale)),
  );
  const perpendicularX = -dy / distance;
  const perpendicularY = dx / distance;
  const flickerFrame = Math.floor(time * style.flickerHz);
  const points = [];

  for (let segment = 0; segment <= segmentCount; segment += 1) {
    const progress = segment / segmentCount;
    const endpointEnvelope = Math.sin(progress * Math.PI);
    const randomOffset = (
      starRandom01(seedBase + segment + flickerFrame * 97, 21) - 0.5
    ) * 2 * style.jitter * scale * endpointEnvelope;
    points.push({
      x: mix(start.x, end.x, progress * completion) + perpendicularX * randomOffset,
      y: mix(start.y, end.y, progress * completion) + perpendicularY * randomOffset,
    });
  }

  const drawArcPass = (rgb, alpha, weight, shadowBlur = 0) => {
    context.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(alpha)})`;
    context.lineWidth = Math.max(0.35, weight * scale * LINE_WEIGHT_GAIN);
    context.shadowColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(alpha)})`;
    context.shadowBlur = shadowBlur * scale;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index += 1) {
      context.lineTo(points[index].x, points[index].y);
    }
    context.stroke();
  };

  context.save();
  context.globalCompositeOperation = style.blendMode;
  context.lineJoin = "round";
  context.lineCap = "round";
  const response = style.response;
  const arcWeight = mix(response.weight[0], response.weight[1], arcStrength);
  const coreAlpha = mix(response.alpha[0], response.alpha[1], arcStrength);
  const glowAlpha = mix(
    response.glowAlpha[0],
    response.glowAlpha[1],
    arcStrength,
  );
  const glowBlur = mix(
    response.glowBlur[0],
    response.glowBlur[1],
    arcStrength,
  );
  drawArcPass(
    style.glowColor,
    glowAlpha / 255 * burstOpacity,
    arcWeight * style.glowWeightMultiplier,
    glowBlur,
  );
  drawArcPass(
    style.coreColor,
    coreAlpha / 255 * burstOpacity,
    arcWeight,
    glowBlur * 0.35,
  );

  const pulseStyle = style.endpointPulse;
  if (pulseStyle) {
    const pulseRadius = mix(
      pulseStyle.radius[0],
      pulseStyle.radius[1],
      arcStrength,
    ) * scale;
    const pulseOpacity = mix(
      pulseStyle.alpha[0],
      pulseStyle.alpha[1],
      arcStrength,
    ) / 255 * burstOpacity;
    const drawEndpointPulse = (point, opacityMultiplier = 1) => {
      const opacity = pulseOpacity * opacityMultiplier;
      const gradient = context.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        pulseRadius,
      );
      gradient.addColorStop(
        0,
        `rgba(${style.coreColor[0]},${style.coreColor[1]},${style.coreColor[2]},${clamp(opacity)})`,
      );
      gradient.addColorStop(
        0.28,
        `rgba(${style.glowColor[0]},${style.glowColor[1]},${style.glowColor[2]},${clamp(opacity * 0.72)})`,
      );
      gradient.addColorStop(
        1,
        `rgba(${style.glowColor[0]},${style.glowColor[1]},${style.glowColor[2]},0)`,
      );
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(point.x, point.y, pulseRadius, 0, Math.PI * 2);
      context.fill();
    };
    drawEndpointPulse(points[0]);
    drawEndpointPulse(points[points.length - 1], isPartial ? 0.62 : 1);
  }
  context.restore();
}

function resetElectricFaultFrameState() {
  electricFaultFrameState = {
    active: false,
    intensity: 0,
    eventIndex: -1,
    anchorY: 0,
    anchorWeight: 0,
    arcCount: 0,
  };
}

function drawBackgroundElectricity(stars, frame, scale, time, style, context) {
  // Seeded time slots distribute electric arcs instead of producing random bursts.
  resetElectricFaultFrameState();
  if (!style?.enabled || stars.length < 2) return;

  const cycleSeconds = Math.max(1, style.cycleSeconds);
  const eventCount = Math.max(1, Math.round(style.eventsPerCycle));
  const slotSeconds = cycleSeconds / eventCount;
  const cycleIndex = Math.floor(time / cycleSeconds);
  const cycleTime = time - cycleIndex * cycleSeconds;
  const containment = getScreenOverlayFrameBounds(frame, scale);
  const eligibleStars = stars.filter(
    (star) => (
      star.baseAlpha >= style.minimumStarAlpha
      && star.x >= containment.left
      && star.x <= containment.right
      && star.y >= containment.top
      && star.y <= containment.bottom
    ),
  );
  if (eligibleStars.length < 2) return;

  context.save();
  context.beginPath();
  context.rect(
    containment.left,
    containment.top,
    containment.right - containment.left,
    containment.bottom - containment.top,
  );
  context.clip();

  const minimumDistance = style.minimumDistance * scale;
  const maximumDistance = style.maximumDistance * scale;
  const minimumDiameter = Math.min(...eligibleStars.map((star) => star.diameter));
  const maximumDiameter = Math.max(...eligibleStars.map((star) => star.diameter));
  const minimumAlpha = Math.min(...eligibleStars.map((star) => star.alpha));
  const maximumAlpha = Math.max(...eligibleStars.map((star) => star.alpha));
  const normalized = (value, minimum, maximum) => clamp(
    (value - minimum) / Math.max(0.0001, maximum - minimum),
  );
  const starStrength = (star) => (
    normalized(star.diameter, minimumDiameter, maximumDiameter)
    + normalized(star.alpha, minimumAlpha, maximumAlpha)
  ) * 0.5;

  for (let eventSlot = 0; eventSlot < eventCount; eventSlot += 1) {
    const eventIndex = cycleIndex * eventCount + eventSlot;
    const duration = Math.min(
      slotSeconds * 0.82,
      mix(
        style.activeSeconds[0],
        style.activeSeconds[1],
        starRandom01(eventIndex, 25),
      ),
    );
    const freeTime = Math.max(0, slotSeconds - duration);
    const centeredStart = eventSlot * slotSeconds + freeTime * 0.5;
    const timingOffset = (
      starRandom01(eventIndex, 26) - 0.5
    ) * freeTime * clamp(style.timingJitter);
    const eventStart = centeredStart + timingOffset;
    const eventTime = cycleTime - eventStart;
    if (eventTime < 0 || eventTime >= duration) continue;

    const minimumArcs = Math.max(1, Math.round(style.arcsPerEvent?.[0] ?? 1));
    const maximumArcs = Math.max(
      minimumArcs,
      Math.round(style.arcsPerEvent?.[1] ?? minimumArcs),
    );
    const arcCount = minimumArcs + Math.floor(
      starRandom01(eventIndex, 27) * (maximumArcs - minimumArcs + 1),
    );
    const usedPairs = new Set();
    let drawnArcs = 0;

    for (
      let attempt = 0;
      attempt < arcCount * 5 && drawnArcs < arcCount;
      attempt += 1
    ) {
      const arcSeed = eventIndex * 131 + attempt;
      const sourceChoice = starRandom01(arcSeed, 23);
      const source = eligibleStars[Math.floor(sourceChoice * eligibleStars.length)];
      const neighbors = eligibleStars
        .filter((candidate) => candidate.index !== source.index)
        .map((candidate) => ({
          star: candidate,
          distance: Math.hypot(candidate.x - source.x, candidate.y - source.y),
        }))
        .filter(({ distance }) => (
          distance >= minimumDistance && distance <= maximumDistance
        ))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, Math.max(1, style.neighborChoices));
      if (!neighbors.length) continue;

      const targetChoice = starRandom01(arcSeed, 24);
      const target = neighbors[Math.floor(targetChoice * neighbors.length)].star;
      const pairKey = source.index < target.index
        ? `${source.index}:${target.index}`
        : `${target.index}:${source.index}`;
      if (usedPairs.has(pairKey)) continue;
      usedPairs.add(pairKey);

      const arcIndex = drawnArcs;
      drawnArcs += 1;

      const arcTiming = style.arcTiming ?? {};
      const startSpreadRatio = clamp(arcTiming.startSpreadRatio ?? 0);
      const durationRange = arcTiming.durationRatio ?? [1, 1];
      const arcStart = duration
        * startSpreadRatio
        * starRandom01(eventIndex * 149 + arcIndex, 28);
      const durationRatio = mix(
        durationRange[0],
        durationRange[1],
        starRandom01(eventIndex * 151 + arcIndex, 29),
      );
      const arcDuration = Math.max(
        0.08,
        Math.min(duration - arcStart, duration * durationRatio),
      );
      const arcTime = eventTime - arcStart;
      if (arcTime < 0 || arcTime >= arcDuration) continue;

      const arcProgress = arcTime / Math.max(0.08, arcDuration);
      const arcEnvelope = Math.sin(arcProgress * Math.PI);
      const flickerPhase = starRandom01(eventIndex * 157 + arcIndex, 30);
      const flickerFrame = Math.floor(
        (time + flickerPhase / Math.max(1, style.flickerHz)) * style.flickerHz,
      );
      const flicker = 0.58 + 0.42 * starRandom01(
        flickerFrame + eventIndex * 257 + arcIndex * 977,
        22,
      );
      const arcOpacity = arcEnvelope * flicker;

      electricFaultFrameState.active = true;
      electricFaultFrameState.eventIndex = eventIndex;
      electricFaultFrameState.intensity = Math.max(
        electricFaultFrameState.intensity,
        arcOpacity,
      );
      electricFaultFrameState.anchorY += (
        (source.y + target.y) * 0.5 * arcOpacity
      );
      electricFaultFrameState.anchorWeight += arcOpacity;
      electricFaultFrameState.arcCount += 1;

      const arcStrength = clamp(
        (starStrength(source) + starStrength(target)) * 0.5,
      );
      drawBackgroundElectricArc(
        source,
        target,
        scale,
        time,
        eventIndex,
        eventSlot * 10 + arcIndex,
        arcOpacity,
        arcStrength,
        style,
        context,
      );
    }
  }

  if (electricFaultFrameState.anchorWeight > 0.0001) {
    electricFaultFrameState.anchorY /= electricFaultFrameState.anchorWeight;
  }
  context.restore();
}

function drawBackgroundStars(frame, scale) {
  const style = BACKGROUND_STAR_FIELD_STYLE;
  if (!style.enabled || style.count <= 0) return;

  const context = drawingContext;
  const starCssColor = (rgb, opacity) =>
    `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamp(opacity, 0, 1)})`;
  const wrap = (value, length) => ((value % length) + length) % length;
  const time = style.motion.enabled ? millis() * 0.001 : 0;
  const inset = style.inset * scale;
  const left = frame.x + inset;
  const top = frame.y + inset;
  const fieldWidth = Math.max(1, frame.width - inset * 2);
  const fieldHeight = Math.max(1, frame.height - inset * 2);
  const farEnd = style.far.share;
  const middleEnd = farEnd + style.middle.share;

  context.save();
  context.beginPath();
  context.rect(frame.x, frame.y, frame.width, frame.height);
  context.clip();

  const stars = [];
  for (let index = 0; index < style.count; index += 1) {
    const depthSelector = starRandom01(index, 0);
    const layer = depthSelector < farEnd
      ? style.far
      : depthSelector < middleEnd
        ? style.middle
        : style.near;
    const sizeMix = starRandom01(index, 1);
    const alphaMix = starRandom01(index, 2);
    const diameter = lerp(layer.diameter[0], layer.diameter[1], sizeMix) * scale;
    const baseAlpha = lerp(layer.alpha[0], layer.alpha[1], alphaMix);
    const baseX = starRandom01(index, 3) * fieldWidth;
    const baseY = starRandom01(index, 4) * fieldHeight;

    const directionJitter = mix(
      -style.motion.directionJitterDegrees,
      style.motion.directionJitterDegrees,
      starRandom01(index, 5),
    );
    const direction = (style.motion.directionDegrees + directionJitter) * Math.PI / 180;
    const speed = lerp(
      layer.speed[0],
      layer.speed[1],
      starRandom01(index, 6),
    ) * scale;
    const curveAmplitude = lerp(
      style.motion.curveAmplitude[0],
      style.motion.curveAmplitude[1],
      starRandom01(index, 7),
    ) * scale;
    const curveCycle = lerp(
      style.motion.curveCycleSeconds[0],
      style.motion.curveCycleSeconds[1],
      starRandom01(index, 8),
    );
    const motionPhase = starRandom01(index, 9) * Math.PI * 2;
    const curveOffset = Math.sin(time * Math.PI * 2 / curveCycle + motionPhase)
      * curveAmplitude;
    const travel = time * speed;

    const x = left + wrap(
      baseX + Math.cos(direction) * travel - Math.sin(direction) * curveOffset,
      fieldWidth,
    );
    const y = top + wrap(
      baseY + Math.sin(direction) * travel + Math.cos(direction) * curveOffset,
      fieldHeight,
    );

    const twinkleCycle = lerp(
      style.motion.twinkleCycleSeconds[0],
      style.motion.twinkleCycleSeconds[1],
      starRandom01(index, 10),
    );
    const twinklePhase = starRandom01(index, 11) * Math.PI * 2;
    const twinkleWave = 0.5 + 0.5 * Math.sin(
      time * Math.PI * 2 / twinkleCycle + twinklePhase,
    );
    const alpha = baseAlpha
      * (1 - style.motion.twinkleAmount + style.motion.twinkleAmount * twinkleWave);

    stars.push({ index, x, y, diameter, alpha, baseAlpha, layer });
  }

  drawBackgroundElectricity(
    stars,
    frame,
    scale,
    time,
    style.electricity,
    context,
  );

  stars.forEach((star) => {
    context.shadowColor = starCssColor(style.color, star.layer.glowAlpha / 255);
    context.shadowBlur = star.layer.glowBlur * scale;
    context.fillStyle = starCssColor(style.color, star.alpha / 255);
    context.beginPath();
    context.arc(star.x, star.y, star.diameter * 0.5, 0, Math.PI * 2);
    context.fill();
  });

  context.restore();
}

function drawElectricFaultGlitch(frame, scale) {
  const style = BACKGROUND_STAR_FIELD_STYLE.electricity.faultGlitch;
  const state = electricFaultFrameState;
  if (!style?.enabled || !state.active) return;

  const minimumIntensity = clamp(style.minimumIntensity);
  if (state.intensity <= minimumIntensity) return;
  const faultStrength = clamp(
    (state.intensity - minimumIntensity) / Math.max(0.001, 1 - minimumIntensity),
  );

  const context = drawingContext;
  const sourceCanvas = context.canvas;
  const containment = getScreenOverlayFrameBounds(frame, scale);
  const clipLeft = containment.left;
  const clipTop = containment.top;
  const clipWidth = Math.max(1, containment.right - containment.left);
  const clipHeight = Math.max(1, containment.bottom - containment.top);
  const clipBottom = clipTop + clipHeight;
  const sourceScaleX = sourceCanvas.width / Math.max(1, width);
  const sourceScaleY = sourceCanvas.height / Math.max(1, height);
  const snapshotScale = clamp(
    style.performance?.snapshotScale ?? 0.4,
    0.25,
    1,
  );
  const refreshFrame = Math.floor(
    millis() * 0.001 * Math.max(1, style.refreshHz),
  );
  const seedBase = state.eventIndex * 10007 + refreshFrame * 379;
  const minimumSlices = Math.max(1, Math.round(style.sliceCount[0]));
  const maximumSlices = Math.max(minimumSlices, Math.round(style.sliceCount[1]));
  const targetSliceCount = mix(minimumSlices, maximumSlices, faultStrength);
  const sliceCount = Math.max(
    minimumSlices,
    Math.min(
      maximumSlices,
      Math.round(targetSliceCount + (starRandom01(seedBase, 41) - 0.5) * 1.4),
    ),
  );

  const snapshotWidth = Math.max(
    1,
    Math.ceil(clipWidth * sourceScaleX * snapshotScale),
  );
  const snapshotHeight = Math.max(
    1,
    Math.ceil(
      maximumSlices
      * style.sliceHeight[1]
      * scale
      * sourceScaleY
      * snapshotScale,
    ),
  );

  if (!electricFaultSnapshotCanvas) {
    electricFaultSnapshotCanvas = document.createElement("canvas");
    electricFaultSnapshotContext = electricFaultSnapshotCanvas.getContext("2d");
  }
  if (
    electricFaultSnapshotCanvas.width !== snapshotWidth
    || electricFaultSnapshotCanvas.height !== snapshotHeight
  ) {
    electricFaultSnapshotCanvas.width = snapshotWidth;
    electricFaultSnapshotCanvas.height = snapshotHeight;
    electricFaultSnapshotKey = "";
  }

  const snapshotKey = [
    state.eventIndex,
    refreshFrame,
    sourceCanvas.width,
    sourceCanvas.height,
    snapshotWidth,
    snapshotHeight,
  ].join(":");
  if (electricFaultSnapshotKey !== snapshotKey) {
    const slices = [];
    for (let index = 0; index < sliceCount; index += 1) {
      const sliceSeed = seedBase + index * 47;
      const sliceHeight = mix(
        style.sliceHeight[0],
        style.sliceHeight[1],
        starRandom01(sliceSeed, 42),
      ) * scale;
      const verticalOffset = (
        starRandom01(sliceSeed, 43) - 0.5
      ) * 2 * style.verticalSpread * scale;
      const sliceY = clamp(
        state.anchorY + verticalOffset,
        clipTop,
        Math.max(clipTop, clipBottom - sliceHeight),
      );
      const baseShiftMagnitude = mix(
        style.horizontalShift[0],
        style.horizontalShift[1],
        starRandom01(sliceSeed, 44),
      ) * scale;
      const shiftDirection = starRandom01(sliceSeed, 45) < 0.5 ? -1 : 1;
      const packedHeight = Math.max(
        1,
        Math.ceil(sliceHeight * sourceScaleY * snapshotScale),
      );

      slices.push({
        sliceSeed,
        sliceY,
        sliceHeight,
        baseShiftMagnitude,
        shiftDirection,
        packedY: 0,
        packedHeight,
      });
    }

    electricFaultSnapshotContext.setTransform(1, 0, 0, 1, 0, 0);
    electricFaultSnapshotContext.globalAlpha = 1;
    electricFaultSnapshotContext.globalCompositeOperation = "source-over";
    electricFaultSnapshotContext.filter = "none";
    electricFaultSnapshotContext.clearRect(0, 0, snapshotWidth, snapshotHeight);
    let packedCursorY = 0;
    slices.forEach((slice) => {
      slice.packedY = packedCursorY;
      electricFaultSnapshotContext.drawImage(
        sourceCanvas,
        clipLeft * sourceScaleX,
        slice.sliceY * sourceScaleY,
        clipWidth * sourceScaleX,
        slice.sliceHeight * sourceScaleY,
        0,
        slice.packedY,
        snapshotWidth,
        slice.packedHeight,
      );
      packedCursorY += slice.packedHeight;
    });
    electricFaultSnapshotSlices = slices;
    electricFaultSnapshotKey = snapshotKey;
  }

  const slices = electricFaultSnapshotSlices;

  context.save();
  context.beginPath();
  context.rect(clipLeft, clipTop, clipWidth, clipHeight);
  context.clip();

  slices.forEach((slice) => {
    const {
      sliceSeed,
      sliceY,
      sliceHeight,
      baseShiftMagnitude,
      shiftDirection,
      packedY,
      packedHeight,
    } = slice;
    const horizontalShift = (
      baseShiftMagnitude * mix(0.38, 1, faultStrength) * shiftDirection
    );
    const displacedOpacity = mix(
      style.displacedOpacity[0],
      style.displacedOpacity[1],
      faultStrength,
    );

    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
    context.filter = "none";
    context.fillStyle = `rgba(0,0,0,${clamp(style.cutoutOpacity * faultStrength)})`;
    context.fillRect(clipLeft, sliceY, clipWidth, sliceHeight);

    context.globalAlpha = displacedOpacity;
    context.drawImage(
      electricFaultSnapshotCanvas,
      0,
      packedY,
      snapshotWidth,
      packedHeight,
      clipLeft + horizontalShift,
      sliceY,
      clipWidth,
      sliceHeight,
    );

    const echoStyle = style.chromaticEcho;
    if (echoStyle?.enabled) {
      const echoOffset = mix(
        echoStyle.offset[0],
        echoStyle.offset[1],
        starRandom01(sliceSeed, 46),
      ) * scale * -shiftDirection;
      context.globalCompositeOperation = "screen";
      context.globalAlpha = echoStyle.opacity * faultStrength;
      context.filter = `hue-rotate(${echoStyle.hueRotateDegrees}deg) saturate(${echoStyle.saturation})`;
      context.drawImage(
        electricFaultSnapshotCanvas,
        0,
        packedY,
        snapshotWidth,
        packedHeight,
        clipLeft + horizontalShift + echoOffset,
        sliceY,
        clipWidth,
        sliceHeight,
      );
    }

    const seamY = starRandom01(sliceSeed, 47) < 0.5
      ? sliceY
      : sliceY + sliceHeight;
    context.globalCompositeOperation = "screen";
    context.globalAlpha = 1;
    context.filter = "none";
    context.strokeStyle = `rgba(${style.seam.color[0]},${style.seam.color[1]},${style.seam.color[2]},${clamp(style.seam.alpha * faultStrength)})`;
    context.lineWidth = Math.max(0.35, style.seam.weight * scale);
    context.beginPath();
    context.moveTo(clipLeft, seamY);
    context.lineTo(clipLeft + clipWidth, seamY);
    context.stroke();
  });

  context.filter = "none";
  context.restore();
}

function drawBackground(palette, frame, scale, cx, cy, radius) {
  background(...palette.background);

  drawBackgroundStars(frame, scale);

  if (!palette.wear) return;
  for (let index = 0; index < 32; index += 1) {
    const y = hash01(`fixed-scan-${index}`) * height;
    stroke(rgba(palette.copperDark, 4 + hash01(`fixed-alpha-${index}`) * 5));
    strokeWeight(0.5);
    line(0, y, width, y);
  }
}

function drawCentralMist(cx, cy, radius) {
  const style = CENTRAL_MIST_STYLE;
  const mistRadius = radius * style.radiusRatio;
  const driftStyle = MOTION_STYLE.mistDrift;
  const driftRadius = radius * driftStyle.radiusRatio;
  const driftX = currentMotionFrame?.enabled
    ? Math.sin(currentMotionFrame.time * Math.PI * 2 / driftStyle.cycleSeconds) * driftRadius
    : 0;
  const driftY = currentMotionFrame?.enabled
    ? Math.cos(currentMotionFrame.time * Math.PI * 2 / (driftStyle.cycleSeconds * 1.23))
      * driftRadius * 0.72
    : 0;
  const mistCenterX = cx + driftX;
  const mistCenterY = cy + driftY;
  const context = drawingContext;
  const gradient = context.createRadialGradient(
    mistCenterX,
    mistCenterY,
    0,
    mistCenterX,
    mistCenterY,
    mistRadius,
  );

  style.stops.forEach((stop) => {
    gradient.addColorStop(
      clamp(stop.at),
      `rgba(${stop.rgb[0]},${stop.rgb[1]},${stop.rgb[2]},${clamp(stop.opacity)})`,
    );
  });

  const drawMistPass = (blendMode, opacity) => {
    context.save();
    context.globalCompositeOperation = blendMode;
    context.globalAlpha *= clamp(opacity);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(cx, cy, mistRadius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  };

  if (style.lineInteraction && style.lineInteraction.opacity > 0) {
    drawMistPass(
      style.lineInteraction.blendMode,
      style.lineInteraction.opacity,
    );
  }
  drawMistPass(style.blendMode, style.opacity);
}

function drawOuterPlate(outer, cx, cy, scale) {
  const palette = PALETTES[paletteName];

  const contourLayers = [
    { ratio: 1.0150, rgb: palette.redDeep, alpha: 150, weight: 0.65 },
    { ratio: 1.0070, rgb: palette.copperDark, alpha: 102, weight: 0.40 },
    { ratio: 1.000, rgb: palette.amber, alpha: 150, weight: 1.00 },
    { ratio: 0.9930, rgb: palette.copperDark, alpha: 96, weight: 0.35 },
    { ratio: 0.9880, rgb: palette.redDeep, alpha: 100, weight: 0.80 },
    { ratio: 0.9650, rgb: palette.redDeep, alpha: 100, weight: 0.60 },
  ];

  contourLayers.forEach((layer) => {
    const points = outer.map((point) => scaledPoint(point, cx, cy, layer.ratio));
    drawCurvedClosedPath(
      points,
      cx,
      cy,
      PERIMETER_CURVE_STYLE.bulge,
      layer.rgb,
      layer.alpha,
      layer.weight * scale,
    );
  });

  outer.forEach((point, index) => {
    const major = index % 3 === 0;
    const radius = (major ? 2.7 : 1.75) * OUTER_NODE_SCALE;
    drawZNode(point, radius, palette, scale);
  });
}

function cross2D(a, b) {
  return a.x * b.y - a.y * b.x;
}

function rayLineIntersection(origin, direction, lineA, lineB) {
  const edgeVector = { x: lineB.x - lineA.x, y: lineB.y - lineA.y };
  const denominator = cross2D(direction, edgeVector);
  if (Math.abs(denominator) < 1e-6) return null;
  const toLine = { x: lineA.x - origin.x, y: lineA.y - origin.y };
  const distance = cross2D(toLine, edgeVector) / denominator;
  if (distance <= 0) return null;
  return {
    x: origin.x + direction.x * distance,
    y: origin.y + direction.y * distance,
  };
}

function drawFadedDashedGuide(start, end, rgb, style, scale) {
  const context = drawingContext;
  const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y);
  const fadeStyle = CALIBRATION_STYLE.guide;
  const fadeReach = clamp(fadeStyle.fadeReach, 0.05, 0.49);
  const peakOpacity = clamp(
    (lineAlpha(style.alpha) / 255) * fadeStyle.peakOpacity,
  );
  const edgeOpacity = peakOpacity * clamp(fadeStyle.edgeOpacity);
  const shoulderOpacity = peakOpacity * clamp(fadeStyle.shoulderOpacity);
  const cssColor = (opacity) =>
    `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.max(0, Math.min(1, opacity))})`;

  gradient.addColorStop(0, cssColor(edgeOpacity));
  gradient.addColorStop(fadeReach * 0.38, cssColor(shoulderOpacity));
  gradient.addColorStop(fadeReach, cssColor(peakOpacity));
  gradient.addColorStop(1 - fadeReach, cssColor(peakOpacity));
  gradient.addColorStop(1 - fadeReach * 0.38, cssColor(shoulderOpacity));
  gradient.addColorStop(1, cssColor(edgeOpacity));

  context.save();
  context.strokeStyle = gradient;
  context.lineWidth = Math.max(0.5, style.weight * scale * LINE_WEIGHT_GAIN);
  context.lineCap = "butt";
  context.setLineDash([
    Math.max(0.1, style.dashLength * scale),
    Math.max(0.1, style.dashGap * scale),
  ]);
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
  context.restore();
}

function drawGuideCrossbar(start, end, rgb, style, scale) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const unitX = dx / length;
  const unitY = dy / length;
  const position = clamp(CALIBRATION_STYLE.crossbar.position);
  const center = {
    x: mix(start.x, end.x, position),
    y: mix(start.y, end.y, position),
  };
  const halfLength = CALIBRATION_STYLE.crossbar.halfLength * scale;
  const perpendicularX = -unitY;
  const perpendicularY = unitX;
  drawOpenLine(
    {
      x: center.x - perpendicularX * halfLength,
      y: center.y - perpendicularY * halfLength,
    },
    {
      x: center.x + perpendicularX * halfLength,
      y: center.y + perpendicularY * halfLength,
    },
    rgb,
    style.alpha,
    style.weight * scale,
  );
}

function calibrationEchoAxisOrder() {
  return OUTER_AXES
    .map((metricIndex, axisIndex) => ({
      axisIndex,
      value: clamp(currentState.metrics[metricIndex]),
    }))
    .sort((left, right) => right.value - left.value || left.axisIndex - right.axisIndex);
}

function drawCalibrationEcho(calibrationFrame, guideOuterFrame, cx, cy, scale, palette) {
  if (!currentMotionFrame?.enabled) return;
  const style = MOTION_STYLE.calibrationEcho;
  const ticksPerEdge = 24;
  const axisOrder = calibrationEchoAxisOrder();
  const cycleSeconds = Math.max(0.6, style.cycleSeconds);
  const cyclePosition = (
    (currentMotionFrame.elapsed % cycleSeconds) / cycleSeconds
  ) * axisOrder.length;
  const orderIndex = Math.floor(cyclePosition) % axisOrder.length;
  const localPhase = cyclePosition - Math.floor(cyclePosition);
  const activeRatio = clamp(style.activeRatio, 0.15, 0.95);
  const activeProgress = clamp(localPhase / activeRatio);
  const headPosition = smoothstep01(activeProgress);
  const fadeIn = smoothstep01(activeProgress / 0.12);
  const fadeOut = localPhase <= activeRatio
    ? 1
    : 1 - smoothstep01((localPhase - activeRatio) / Math.max(0.001, 1 - activeRatio));
  const activity = fadeIn * fadeOut;
  const activeAxis = axisOrder[orderIndex];
  const dataStrength = 0.78 + activeAxis.value * 0.22;
  const bandWidth = Math.max(0.035, style.bandWidth);

  [activeAxis.axisIndex, activeAxis.axisIndex + 6].forEach((edge) => {
    const edgeStart = calibrationFrame[edge];
    const edgeEnd = calibrationFrame[(edge + 1) % calibrationFrame.length];
    const curvedEdge = buildCurvedPolygonEdge(
      edgeStart,
      edgeEnd,
      cx,
      cy,
      PERIMETER_CURVE_STYLE.bulge,
    );
    const middle = quadraticEdgePoint(curvedEdge, 0.5);
    const middleNormal = curvedEdgeNormal(curvedEdge, 0.5, cx, cy);

    for (let tick = 1; tick < ticksPerEdge; tick += 1) {
      const distanceFromMiddle = Math.abs(tick - ticksPerEdge * 0.5) / (ticksPerEdge * 0.5);
      const distanceFromHead = Math.abs(distanceFromMiddle - headPosition);
      const wave = Math.pow(
        Math.max(0, 1 - distanceFromHead / bandWidth),
        Math.max(0.2, style.falloffPower),
      );
      const brightness = wave * activity * dataStrength;
      if (brightness <= 0.002) continue;

      const t = tick / ticksPerEdge;
      const point = quadraticEdgePoint(curvedEdge, t);
      const tickNormal = curvedEdgeNormal(curvedEdge, t, cx, cy);
      const isCenterTick = tick === 12;
      const isSideLongTick = tick === 2 || tick === 22;
      const baseTickStyle = isCenterTick
        ? CALIBRATION_STYLE.ticks.center
        : isSideLongTick
          ? CALIBRATION_STYLE.ticks.side
          : CALIBRATION_STYLE.ticks.short;
      const inwardLength = Math.max(style.inward, baseTickStyle.inward) * scale;
      const outwardLength = Math.max(style.outward, baseTickStyle.outward) * scale;

      drawOpenLine(
        {
          x: point.x - tickNormal.x * inwardLength,
          y: point.y - tickNormal.y * inwardLength,
        },
        {
          x: point.x + tickNormal.x * outwardLength,
          y: point.y + tickNormal.y * outwardLength,
        },
        palette[style.color],
        style.alpha * brightness,
        style.weight * scale,
      );
    }

    const guideBrightness = activity * dataStrength * Math.pow(1 - activeProgress, 0.72);
    if (guideBrightness > 0.005) {
      const centerTickStyle = CALIBRATION_STYLE.ticks.center;
      const guideStart = {
        x: middle.x + middleNormal.x * centerTickStyle.outward * scale,
        y: middle.y + middleNormal.y * centerTickStyle.outward * scale,
      };
      const outerA = guideOuterFrame[edge];
      const outerB = guideOuterFrame[(edge + 1) % guideOuterFrame.length];
      const outerCurve = buildCurvedPolygonEdge(
        outerA,
        outerB,
        cx,
        cy,
        PERIMETER_CURVE_STYLE.bulge,
      );
      const guideEnd = rayCurvedEdgeIntersection(
        guideStart,
        middleNormal,
        outerCurve,
      );
      if (guideEnd) {
        drawFadedDashedGuide(
          guideStart,
          guideEnd,
          palette[style.guide.color],
          {
            ...style.guide,
            alpha: style.guide.alpha * guideBrightness,
          },
          scale,
        );
      }
    }
  });
}

function drawPolygonCalibration(outer, layerA, cx, cy, scale) {
  // Ticks follow the curved perimeter normal; guides derive from Z/A geometry.
  const palette = PALETTES[paletteName];
  const calibrationRatio = CALIBRATION_STYLE.frame.ratio;
  const guideOuterRatio = CALIBRATION_STYLE.guide.outerRatio;
  const calibrationFrame = outer.map((point) => scaledPoint(point, cx, cy, calibrationRatio));
  const guideOuterFrame = outer.map((point) => scaledPoint(point, cx, cy, guideOuterRatio));
  drawCurvedClosedPath(
    calibrationFrame,
    cx,
    cy,
    PERIMETER_CURVE_STYLE.bulge,
    palette[CALIBRATION_STYLE.frame.color],
    CALIBRATION_STYLE.frame.alpha,
    CALIBRATION_STYLE.frame.weight * scale,
  );
  const sideGuidesByNode = Array.from({ length: 12 }, () => []);

  for (let edge = 0; edge < 12; edge += 1) {
    const a = calibrationFrame[edge];
    const b = calibrationFrame[(edge + 1) % 12];
    const curvedEdge = buildCurvedPolygonEdge(
      a,
      b,
      cx,
      cy,
      PERIMETER_CURVE_STYLE.bulge,
    );

    for (let tick = 1; tick < 24; tick += 1) {
      const t = tick / 24;
      const onFrame = quadraticEdgePoint(curvedEdge, t);
      const tickNormal = curvedEdgeNormal(curvedEdge, t, cx, cy);
      const isCenterTick = tick === 12;
      const isSideLongTick = tick === 2 || tick === 22;
      const hasGuide = isCenterTick || isSideLongTick;
      const tickStyle = isCenterTick
        ? CALIBRATION_STYLE.ticks.center
        : isSideLongTick
          ? CALIBRATION_STYLE.ticks.side
          : CALIBRATION_STYLE.ticks.short;

      const inwardLength = tickStyle.inward * scale;
      const outwardLength = tickStyle.outward * scale;
      const start = {
        x: onFrame.x - tickNormal.x * inwardLength,
        y: onFrame.y - tickNormal.y * inwardLength,
      };
      const end = {
        x: onFrame.x + tickNormal.x * outwardLength,
        y: onFrame.y + tickNormal.y * outwardLength,
      };
      drawOpenLine(
        start,
        end,
        palette[tickStyle.color],
        tickStyle.alpha,
        tickStyle.weight * scale,
      );

      if (hasGuide) {
        const outerA = guideOuterFrame[edge];
        const outerB = guideOuterFrame[(edge + 1) % 12];
        let guideDirection;
        let nearbyZNode = null;
        let nearbyANode = null;
        let nearbyNodeIndex = null;

        if (isCenterTick) {
          guideDirection = tickNormal;
        } else {
          nearbyNodeIndex = tick === 2 ? edge : (edge + 1) % 12;
          nearbyZNode = outer[nearbyNodeIndex];
          nearbyANode = layerA[nearbyNodeIndex];
          const zaLength = Math.max(
            1,
            Math.hypot(nearbyZNode.x - nearbyANode.x, nearbyZNode.y - nearbyANode.y),
          );
          guideDirection = {
            x: (nearbyZNode.x - nearbyANode.x) / zaLength,
            y: (nearbyZNode.y - nearbyANode.y) / zaLength,
          };
        }

        const guideStart = isCenterTick ? end : onFrame;
        const outerCurve = buildCurvedPolygonEdge(
          outerA,
          outerB,
          cx,
          cy,
          PERIMETER_CURVE_STYLE.bulge,
        );
        const guideEnd = rayCurvedEdgeIntersection(
          guideStart,
          guideDirection,
          outerCurve,
        );
        if (guideEnd) {
          const guideStyle = isCenterTick
            ? CALIBRATION_STYLE.guide.center
            : CALIBRATION_STYLE.guide.side;
          drawFadedDashedGuide(
            guideStart,
            guideEnd,
            palette[guideStyle.color],
            guideStyle,
            scale,
          );
          if (isCenterTick) {
            const crossbarStyle = CALIBRATION_STYLE.crossbar.center;
            drawGuideCrossbar(
              guideStart,
              guideEnd,
              palette[crossbarStyle.color],
              crossbarStyle,
              scale,
            );
          } else {
            sideGuidesByNode[nearbyNodeIndex].push({
              start: guideStart,
              end: guideEnd,
              direction: guideDirection,
            });
          }
        }
      }
    }
  }

  sideGuidesByNode.forEach((guides) => {
    if (guides.length !== 2) return;
    const connectorStyle = CALIBRATION_STYLE.sideParallelConnector;
    const position = clamp(connectorStyle.position);
    const direction = guides[0].direction;
    const candidatePoints = guides.map((guide) => ({
      x: mix(guide.start.x, guide.end.x, position),
      y: mix(guide.start.y, guide.end.y, position),
    }));
    const commonProjection =
      candidatePoints.reduce(
        (sum, point) => sum + point.x * direction.x + point.y * direction.y,
        0,
      ) / candidatePoints.length;
    const connectorPoints = guides.map((guide) => {
      const startProjection = guide.start.x * direction.x + guide.start.y * direction.y;
      const distanceAlongGuide = commonProjection - startProjection;
      return {
        x: guide.start.x + direction.x * distanceAlongGuide,
        y: guide.start.y + direction.y * distanceAlongGuide,
      };
    });
    drawOpenLine(
      connectorPoints[0],
      connectorPoints[1],
      palette[connectorStyle.color],
      connectorStyle.alpha,
      connectorStyle.weight * scale,
    );
  });

  drawCalibrationEcho(calibrationFrame, guideOuterFrame, cx, cy, scale, palette);
}

// #endregion [F04]

// #region [F05] Central Purple Field and Classification Core

function resolvePurpleRingCount(fieldStyle = PURPLE_STRUCTURE_STYLE.field) {
  const style = fieldStyle.ringCount;
  if (Number.isFinite(style)) return Math.max(2, Math.round(style));
  const minimum = Math.max(2, Math.round(style?.minimum ?? 9));
  const maximum = Math.max(minimum, Math.round(style?.maximum ?? minimum));
  const certainty = Math.pow(
    clamp(currentState.classificationCertainty),
    Math.max(0.05, style?.power ?? 1),
  );
  return Math.round(mix(minimum, maximum, certainty));
}

function buildUprightFieldHexagon(geometry, cx, cy, scaleValue, fieldStyle) {
  const leftDistance = Math.abs((geometry.m1?.x ?? cx) - cx);
  const rightDistance = Math.abs((geometry.m2?.x ?? cx) - cx);
  const sourceHalfWidth = Math.max(1, (leftDistance + rightDistance) * 0.5);
  const horizontalStretch = Math.max(0.05, fieldStyle.horizontalStretch ?? 1);
  const geometryStyle = fieldStyle.uprightGeometry ?? {};
  const cornerXRatio = clamp(geometryStyle.cornerXRatio ?? 0.5, 0.05, 0.95);
  const heightToWidthRatio = Math.max(
    0.05,
    geometryStyle.heightToWidthRatio ?? 0.72,
  );
  const halfWidth = sourceHalfWidth * horizontalStretch * scaleValue;
  const halfHeight = halfWidth * heightToWidthRatio;
  const cornerX = halfWidth * cornerXRatio;

  return [
    { x: cx - cornerX, y: cy - halfHeight },
    { x: cx + cornerX, y: cy - halfHeight },
    { x: cx + halfWidth, y: cy },
    { x: cx + cornerX, y: cy + halfHeight },
    { x: cx - cornerX, y: cy + halfHeight },
    { x: cx - halfWidth, y: cy },
  ];
}

function drawInnerField(geometry, cx, cy, scale) {
  // Upright concentric hexagons reveal from the centre and continue a radial pulse.
  const palette = PALETTES[paletteName];
  const style = PURPLE_STRUCTURE_STYLE.field;
  const ringCount = resolvePurpleRingCount(style);
  const rings = [];
  for (let ring = 0; ring < ringCount; ring += 1) {
    const ringScale = mix(
      style.innerScale,
      style.outerScale,
      ring / Math.max(1, ringCount - 1),
    );
    const points = buildUprightFieldHexagon(
      geometry,
      cx,
      cy,
      ringScale,
      style,
    );
    rings.push(points);
    const isSolidRing = ring < style.solidRingCount;
    const ringStyle = isSolidRing ? style.solidRing : style.dashedRing;
    const ringProgress = ring / Math.max(1, ringCount - 1);
    const ringAlpha = ringStyle.alpha * purpleRingVisibility(ringProgress, style);
    drawVertexFocusedGradientRing(
      points,
      palette,
      ringStyle,
      ringAlpha,
      !isSolidRing,
      style.dashLength,
      style.dashGap,
      scale,
    );
  }

  const diagonalStyle = style.diagonals;
  diagonalStyle.vertexIndices.forEach((vertexIndex) => {
    drawDashedPath(
      [rings[0][vertexIndex], rings[rings.length - 1][vertexIndex]],
      false,
      palette[diagonalStyle.color],
      diagonalStyle.alpha,
      diagonalStyle.weight * scale,
      diagonalStyle.dashLength,
      diagonalStyle.dashGap,
      scale,
    );
  });

  const axisWeaveStyle = diagonalStyle.axisWeave;
  if (axisWeaveStyle?.enabled) {
    const firstDashedRing = Math.min(ringCount, Math.max(0, style.solidRingCount));
    const connectionLayerCount = Math.max(0, ringCount - firstDashedRing - 1);
    if (connectionLayerCount > 0) {
      const verticalIntersectionY = (pointA, pointB) => {
        const dx = pointB.x - pointA.x;
        if (Math.abs(dx) < 0.0001) return (pointA.y + pointB.y) * 0.5;
        const t = (cx - pointA.x) / dx;
        return mix(pointA.y, pointB.y, t);
      };

      for (let ring = firstDashedRing; ring < ringCount - 1; ring += 1) {
        const dashedIndex = ring - firstDashedRing;
        const progress = dashedIndex / Math.max(1, connectionLayerCount - 1);
        const ringProgress = ring / Math.max(1, ringCount - 1);
        const waveMultiplier = purpleRadialWaveMultiplier(ringProgress);
        const fade = axisWeaveStyle.fade;
        const opacity = mix(
          fade.innerOpacity,
          fade.outerOpacity,
          Math.pow(progress, Math.max(0.05, fade.power)),
        );
        const ringPoints = rings[ring];
        const outerRingPoints = rings[ring + 1];
        const outerUpperAxisY = verticalIntersectionY(
          outerRingPoints[0],
          outerRingPoints[1],
        );
        const outerLowerAxisY = verticalIntersectionY(
          outerRingPoints[4],
          outerRingPoints[3],
        );
        const offset = axisWeaveStyle.outsideOffset * scale;
        const upperAxisPoint = { x: cx, y: outerUpperAxisY - offset };
        const lowerAxisPoint = { x: cx, y: outerLowerAxisY + offset };

        [0, 1].forEach((vertexIndex) => {
          drawDashedPath(
            [ringPoints[vertexIndex], upperAxisPoint],
            false,
            palette[axisWeaveStyle.color],
            axisWeaveStyle.alpha * opacity * waveMultiplier,
            axisWeaveStyle.weight * scale,
            axisWeaveStyle.dashLength,
            axisWeaveStyle.dashGap,
            scale,
          );
        });
        [3, 4].forEach((vertexIndex) => {
          drawDashedPath(
            [ringPoints[vertexIndex], lowerAxisPoint],
            false,
            palette[axisWeaveStyle.color],
            axisWeaveStyle.alpha * opacity * waveMultiplier,
            axisWeaveStyle.weight * scale,
            axisWeaveStyle.dashLength,
            axisWeaveStyle.dashGap,
            scale,
          );
        });
      }
    }
  }

  const referenceStyle = style.paleReferenceHexagons;
  const scaleStep = (style.outerScale - style.innerScale) / Math.max(1, ringCount - 1);
  for (let layer = 0; layer < referenceStyle.count; layer += 1) {
    const referenceScale = style.innerScale
      + scaleStep * (layer + clamp(referenceStyle.intervalPosition));
    const referencePoints = buildUprightFieldHexagon(
      geometry,
      cx,
      cy,
      referenceScale,
      style,
    );
    drawClosedPath(
      referencePoints,
      palette[referenceStyle.color],
      referenceStyle.alpha,
      referenceStyle.weight * scale,
    );
  }
}

function drawInnerFieldIntersections(geometry, cx, cy) {
  const palette = PALETTES[paletteName];
  const fieldStyle = PURPLE_STRUCTURE_STYLE.field;
  const ringCount = resolvePurpleRingCount(fieldStyle);
  const diagonalStyle = fieldStyle.diagonals;
  const intersectionStyle = diagonalStyle.intersection;
  const intersectionRgb = palette[intersectionStyle.color];
  const diameter = Math.max(
    1.0,
    intersectionStyle.diameter * LINE_WEIGHT_GAIN,
  );
  const context = drawingContext;

  context.save();
  context.globalCompositeOperation = "source-over";
  context.fillStyle = `rgb(${intersectionRgb[0]},${intersectionRgb[1]},${intersectionRgb[2]})`;

  const firstDashedRing = Math.min(
    ringCount,
    Math.max(0, fieldStyle.solidRingCount),
  );

  for (let ring = firstDashedRing; ring < ringCount; ring += 1) {
    const ringScale = mix(
      fieldStyle.innerScale,
      fieldStyle.outerScale,
      ring / Math.max(1, ringCount - 1),
    );
    const ringProgress = ring / Math.max(1, ringCount - 1);
    const constructionProgress = purpleRingConstructionProgress(ringProgress);
    if (constructionProgress <= 0.001) continue;
    const intersectionAlpha = clamp(
      (intersectionStyle.alpha / 255)
      * purpleRingVisibility(ringProgress, fieldStyle),
    );
    const ringPoints = buildUprightFieldHexagon(
      geometry,
      cx,
      cy,
      ringScale,
      fieldStyle,
    );
    const intersectionVertexIndices = intersectionStyle.vertexIndices
      ?? diagonalStyle.vertexIndices;
    intersectionVertexIndices.forEach((vertexIndex) => {
      const isHorizontalVertex = intersectionStyle.horizontalVertexIndices
        ?.includes(vertexIndex);
      context.globalAlpha = intersectionAlpha * (
        isHorizontalVertex ? intersectionStyle.horizontalOpacity : 1
      );
      const point = ringPoints[vertexIndex];
      context.beginPath();
      context.arc(
        point.x,
        point.y,
        diameter * constructionProgress * 0.5,
        0,
        Math.PI * 2,
      );
      context.fill();
    });
  }
  context.restore();
}

// #endregion [F05]

// #region [F06] Derived A/B Geometry and Connections

function buildDerivedNodeLayer(outer, cx, cy, layerStyle) {
  return outer.map((point, index) => {
    const previous = outer[(index + 11) % 12];
    const next = outer[(index + 1) % 12];
    const radius = Math.max(1, Math.hypot(point.x - cx, point.y - cy));
    const previousRadius = Math.hypot(previous.x - cx, previous.y - cy);
    const nextRadius = Math.hypot(next.x - cx, next.y - cy);
    const radialX = (point.x - cx) / radius;
    const radialY = (point.y - cy) / radius;
    const tangentX = -radialY;
    const tangentY = radialX;
    const localSlope = (nextRadius - previousRadius) * 0.5;
    const localCurvature = radius - (previousRadius + nextRadius) * 0.5;
    const limitedCurvature = clamp(
      localCurvature,
      -radius * DERIVED_GEOMETRY_STYLE.curvatureLimit,
      radius * DERIVED_GEOMETRY_STYLE.curvatureLimit,
    );
    const limitedSlope = clamp(
      localSlope,
      -radius * DERIVED_GEOMETRY_STYLE.slopeLimit,
      radius * DERIVED_GEOMETRY_STYLE.slopeLimit,
    );
    const derivedRadius =
      radius * layerStyle.radialRatio
      + limitedCurvature * layerStyle.curvatureGain;
    const tangentOffset = limitedSlope * layerStyle.tangentGain;
    return {
      x: cx + radialX * derivedRadius + tangentX * tangentOffset,
      y: cy + radialY * derivedRadius + tangentY * tangentOffset,
    };
  });
}

function rayPolygonBoundaryDistance(cx, cy, directionX, directionY, polygon) {
  let nearestDistance = Infinity;
  polygon.forEach((start, index) => {
    const end = polygon[(index + 1) % polygon.length];
    const segmentX = end.x - start.x;
    const segmentY = end.y - start.y;
    const denominator = directionX * segmentY - directionY * segmentX;
    if (Math.abs(denominator) < 1e-8) return;

    const originToStartX = start.x - cx;
    const originToStartY = start.y - cy;
    const rayDistance =
      (originToStartX * segmentY - originToStartY * segmentX) / denominator;
    const segmentPosition =
      (originToStartX * directionY - originToStartY * directionX) / denominator;

    if (
      rayDistance >= 0
      && segmentPosition >= -1e-7
      && segmentPosition <= 1 + 1e-7
    ) {
      nearestDistance = Math.min(nearestDistance, rayDistance);
    }
  });
  return nearestDistance;
}

function constrainPointInsideCalibration(
  point,
  calibrationFrame,
  cx,
  cy,
  insetRatio,
) {
  const offsetX = point.x - cx;
  const offsetY = point.y - cy;
  const pointDistance = Math.hypot(offsetX, offsetY);
  if (pointDistance < 1e-8) return point;

  const directionX = offsetX / pointDistance;
  const directionY = offsetY / pointDistance;
  const boundaryDistance = rayPolygonBoundaryDistance(
    cx,
    cy,
    directionX,
    directionY,
    calibrationFrame,
  );
  if (!Number.isFinite(boundaryDistance)) return point;

  const maximumDistance = Math.max(
    0,
    boundaryDistance * (1 - clamp(insetRatio, 0, 0.25)),
  );
  if (pointDistance <= maximumDistance) return point;

  return {
    x: cx + directionX * maximumDistance,
    y: cy + directionY * maximumDistance,
  };
}

function buildDerivedNodeLayers(outer, cx, cy) {
  // A and B inherit perimeter directions but use separate data-driven offsets.
  const rawLayerA = buildDerivedNodeLayer(
    outer,
    cx,
    cy,
    DERIVED_GEOMETRY_STYLE.layerA,
  );
  const calibrationFrame = outer.map((point) => scaledPoint(
    point,
    cx,
    cy,
    CALIBRATION_STYLE.frame.ratio,
  ));
  return {
    layerA: rawLayerA.map((point) => constrainPointInsideCalibration(
      point,
      calibrationFrame,
      cx,
      cy,
      DERIVED_GEOMETRY_STYLE.layerA.calibrationInsetRatio,
    )),
    layerB: buildDerivedNodeLayer(outer, cx, cy, DERIVED_GEOMETRY_STYLE.layerB),
  };
}

function drawDerivedNodeLattice(layerA, layerB, scale) {
  // Direct A_i–B_i links remain; selected neighbouring links are seeded per plate.
  const palette = PALETTES[paletteName];
  const aRingStyle = DERIVED_LINE_STYLE.aRing;
  const bRingStyle = DERIVED_LINE_STYLE.bRing;
  const aToBStyle = DERIVED_LINE_STYLE.aToB;
  const derivedProgress = currentMotionFrame?.layerProgress.derived ?? 1;

  withMotionOpacity(progressBetween(derivedProgress, 0.00, 0.34), () => {
    drawClosedPath(
      layerA,
      palette[aRingStyle.color],
      aRingStyle.alpha,
      aRingStyle.weight * scale,
    );
  });
  withMotionOpacity(progressBetween(derivedProgress, 0.20, 0.56), () => {
    drawClosedPath(
      layerB,
      palette[bRingStyle.color],
      bRingStyle.alpha,
      bRingStyle.weight * scale,
    );
  });

  const subjectKey = activeSignal.subjectId;
  const shouldKeepNeighborLine = (index, side) =>
    hash01(`${subjectKey}:derived-ab:neighbor:${index}:${side}`)
      < clamp(aToBStyle.neighborKeepRatio);
  const neighborRevealStyle = aToBStyle.neighborReveal;

  for (let index = 0; index < 12; index += 1) {
    const connectionOrder = index / 11;
    const revealOffset = connectionOrder * Math.max(0, neighborRevealStyle.stagger);
    const neighborConnectionOpacity = progressBetween(
      derivedProgress,
      neighborRevealStyle.start + revealOffset,
      neighborRevealStyle.end + revealOffset,
    );
    drawOpenLine(
      layerA[index],
      layerB[index],
      palette[aToBStyle.color],
      aToBStyle.alpha,
      aToBStyle.weight * scale,
    );

    const isExpandedNode = index % 2 === 1;
    if (isExpandedNode) {
      if (shouldKeepNeighborLine(index, -1)) {
        withMotionOpacity(neighborConnectionOpacity, () => {
          drawOpenLine(
            layerA[index],
            layerB[(index + 11) % 12],
            palette[aToBStyle.color],
            aToBStyle.alpha,
            aToBStyle.weight * scale,
          );
        });
      }
      if (shouldKeepNeighborLine(index, 1)) {
        withMotionOpacity(neighborConnectionOpacity, () => {
          drawOpenLine(
            layerA[index],
            layerB[(index + 1) % 12],
            palette[aToBStyle.color],
            aToBStyle.alpha,
            aToBStyle.weight * scale,
          );
        });
      }
    }
  }
}

function drawDerivedNodes(layerA, layerB, scale) {
  const palette = PALETTES[paletteName];
  const derivedProgress = currentMotionFrame?.layerProgress.derived ?? 1;
  withMotionOpacity(progressBetween(derivedProgress, 0.05, 0.38), () => {
    layerA.forEach((point, index) => {
      drawCoreOnlyNode(point, index % 3 === 0 ? 2.5 : 2.0, scale);
    });
  });
  withMotionOpacity(progressBetween(derivedProgress, 0.24, 0.60), () => {
    layerB.forEach((point, index) => {
      drawCoreOnlyNode(point, index % 3 === 0 ? 2.2 : 1.75, scale);
    });
  });
}

// #endregion [F06]

// #region [F07] Layered Node Rendering

function drawRadialNodeLayer(point, layerRadius, stops, glow = null, scale = 1) {
  const context = drawingContext;
  const gradient = context.createRadialGradient(
    point.x,
    point.y,
    0,
    point.x,
    point.y,
    layerRadius,
  );
  stops.forEach((stop) => {
    gradient.addColorStop(
      clamp(stop.at),
      `rgba(${stop.rgb[0]},${stop.rgb[1]},${stop.rgb[2]},${clamp(stop.opacity)})`,
    );
  });
  context.save();
  if (glow) {
    const glowRgb = glow.rgb ?? stops[0]?.rgb ?? [255, 255, 255];
    context.shadowColor = `rgba(${glowRgb[0]},${glowRgb[1]},${glowRgb[2]},${clamp(glow.opacity)})`;
    context.shadowBlur = Math.max(0, glow.blur * scale);
  }
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(point.x, point.y, layerRadius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawCoreOnlyNode(point, radius, scale) {
  const style = CORE_ONLY_NODE_STYLE;
  const scaledRadius = Math.max(0.6, radius * scale);
  drawRadialNodeLayer(
    point,
    scaledRadius * style.diameter * 0.5,
    style.stops,
  );
}

function drawLayeredNode(point, radius, scale, style) {
  const scaledRadius = Math.max(0.6, radius * scale);
  const coreRadius = style.layerRadii
    ? Math.max(0.6, style.layerRadii.core * scale)
    : scaledRadius * style.core.diameter * 0.5;
  const orangeRadius = style.layerRadii
    ? Math.max(0.6, style.layerRadii.orange * scale)
    : scaledRadius * style.orange.diameter * 0.5;
  const haloRadius = style.layerRadii
    ? Math.max(0.6, style.layerRadii.redHalo * scale)
    : scaledRadius * style.redHalo.diameter * 0.5;

  drawRadialNodeLayer(
    point,
    haloRadius,
    style.redHalo.stops,
    style.redHalo.glow,
    scale,
  );
  drawRadialNodeLayer(
    point,
    orangeRadius,
    style.orange.stops,
    style.orange.glow,
    scale,
  );
  drawRadialNodeLayer(
    point,
    coreRadius,
    style.core.stops,
    style.core.glow,
    scale,
  );
}

function drawZNode(point, radius, palette, scale) {
  drawLayeredNode(point, radius, scale, OUTER_Z_NODE_STYLE);
}

function mixRgb(a, b, amount) {
  return a.map((channel, index) => Math.round(mix(channel, b[index], amount)));
}

function buildResponsiveMainNodeStyle(value, base) {
  // Map one 0..1 semantic value to core, orange shell, halo and opacity response.
  const response = base.response;
  const amount = Math.pow(clamp(value), Math.max(0.05, response.power));
  const coreOpacityLow = response.coreOpacityLow
    ?? response.coreCenterOpacityLow
    ?? 1.00;
  const coreOpacityHigh = response.coreOpacityHigh ?? 1.00;
  const orangeOpacityLow = response.orangeOpacityLow ?? 1.00;
  const orangeOpacityHigh = response.orangeOpacityHigh ?? 1.00;
  const haloOpacityLow = response.haloOpacityLow ?? 1.00;
  const haloOpacityHigh = response.haloOpacityHigh ?? 1.00;
  const coreOpacityGain = mix(coreOpacityLow, coreOpacityHigh, amount);
  const orangeOpacityGain = mix(orangeOpacityLow, orangeOpacityHigh, amount);
  const haloOpacityGain = mix(haloOpacityLow, haloOpacityHigh, amount);

  let layerRadii;
  if (base.sizeResponse) {
    const size = base.sizeResponse;
    const coreAmount = Math.pow(clamp(value), Math.max(0.05, size.corePower));
    const haloAmount = Math.pow(clamp(value), Math.max(0.05, size.haloPower));
    const coreRadius = mix(size.coreRadiusLow, size.coreRadiusHigh, coreAmount);
    layerRadii = {
      core: coreRadius,
      orange: coreRadius * size.orangeToCoreRatio,
      redHalo: mix(size.haloRadiusLow, size.haloRadiusHigh, haloAmount),
    };
  }

  return {
    layerRadii,
    core: {
      diameter: base.core.diameter,
      glow: base.core.glow,
      stops: base.core.stops.map((stop, index) => ({
        ...stop,
        rgb: index === 0
          ? mixRgb(response.coreCenterLow, stop.rgb, amount)
          : stop.rgb,
        opacity: clamp(stop.opacity * coreOpacityGain),
      })),
    },
    orange: {
      diameter: base.orange.diameter,
      glow: base.orange.glow,
      stops: base.orange.stops.map((stop) => ({
        ...stop,
        rgb: mixRgb(response.orangeLow, stop.rgb, amount),
        opacity: clamp(stop.opacity * orangeOpacityGain),
      })),
    },
    redHalo: {
      diameter: base.redHalo.diameter,
      stops: base.redHalo.stops.map((stop) => ({
        ...stop,
        rgb: mixRgb(response.haloLow, stop.rgb, amount),
        opacity: clamp(stop.opacity * haloOpacityGain),
      })),
    },
  };
}

function drawMainNode(point, radius, value, scale, style = MAIN_NODE_STYLE) {
  const responsiveStyle = buildResponsiveMainNodeStyle(value, style);
  const pulseStyle = MOTION_STYLE.mainNodePulse;
  const phase = hash01(
    `${activeSignal.subjectId}:main-node-pulse:${point.x.toFixed(1)}:${point.y.toFixed(1)}`,
  ) * Math.PI * 2;
  const pulse = currentMotionFrame?.enabled
    ? periodicWave(pulseStyle.cycleSeconds, phase)
    : 0.5;
  const haloGain = mix(
    1 - pulseStyle.haloAmplitude,
    1 + pulseStyle.haloAmplitude,
    pulse,
  );
  const orangeGain = mix(
    1 - pulseStyle.orangeAmplitude,
    1 + pulseStyle.orangeAmplitude,
    pulse,
  );
  const animatedStyle = {
    ...responsiveStyle,
    orange: {
      ...responsiveStyle.orange,
      stops: responsiveStyle.orange.stops.map((stop) => ({
        ...stop,
        opacity: clamp(stop.opacity * orangeGain),
      })),
    },
    redHalo: {
      ...responsiveStyle.redHalo,
      stops: responsiveStyle.redHalo.stops.map((stop) => ({
        ...stop,
        opacity: clamp(stop.opacity * haloGain),
      })),
    },
  };
  drawLayeredNode(
    point,
    radius,
    scale,
    animatedStyle,
  );
}

function drawHorizontalNode(point, radius, scale) {
  drawLayeredNode(point, radius, scale, HORIZONTAL_NODE_STYLE);
}

function drawCenterNode(point, radius, scale) {
  drawLayeredNode(point, radius, scale, CENTER_NODE_STYLE);
}

function drawDashedCircle(center, radius, rgb, alpha, weight, dashLength, dashGap, scale) {
  const context = drawingContext;
  context.save();
  context.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(lineAlpha(alpha) / 255)})`;
  context.lineWidth = Math.max(0.5, weight * scale * LINE_WEIGHT_GAIN);
  context.setLineDash([
    Math.max(0.1, dashLength * scale),
    Math.max(0.1, dashGap * scale),
  ]);
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function drawOuterZDecorations(outer, layerA, cx, cy, scale) {
  const palette = PALETTES[paletteName];
  const ringStyle = OUTER_Z_DECORATION_STYLE.dashedRing;
  const markStyle = OUTER_Z_DECORATION_STYLE.extensionMark;
  const lineColor = palette[Z_DECORATION_LINE_STYLE.color];
  const lineWeight = Z_DECORATION_LINE_STYLE.weight * scale;

  outer.forEach((zNode, index) => {
    const aNode = layerA[index];
    const zRadius = (index % 3 === 0 ? 2.7 : 1.75) * OUTER_NODE_SCALE;
    const dx = zNode.x - aNode.x;
    const dy = zNode.y - aNode.y;
    const directionLength = Math.max(1, Math.hypot(dx, dy));
    let axisX = dx / directionLength;
    let axisY = dy / directionLength;
    if (axisX * (zNode.x - cx) + axisY * (zNode.y - cy) < 0) {
      axisX *= -1;
      axisY *= -1;
    }
    const crossX = -axisY;
    const crossY = axisX;

    drawDashedCircle(
      zNode,
      zRadius * ringStyle.diameter * 0.5 * scale,
      palette[ringStyle.color],
      ringStyle.alpha,
      ringStyle.weight,
      ringStyle.dashLength,
      ringStyle.dashGap,
      scale,
    );

    const baseDistance = zRadius * markStyle.clearance * scale;
    const axisLength = markStyle.axisLength * scale;
    const gap = markStyle.gap * scale;
    const shortBarHalf = markStyle.shortBarHalfLength * scale;
    const longBarHalf = markStyle.longBarHalfLength * scale;
    const pointAt = (distance) => ({
      x: zNode.x + axisX * distance,
      y: zNode.y + axisY * distance,
    });
    const drawAxisSegment = (startDistance, endDistance) => {
      drawOpenLine(
        pointAt(startDistance),
        pointAt(endDistance),
        lineColor,
        Z_DECORATION_LINE_STYLE.alpha,
        lineWeight,
      );
    };
    const drawCrossbar = (distance, halfLength) => {
      const center = pointAt(distance);
      drawOpenLine(
        { x: center.x - crossX * halfLength, y: center.y - crossY * halfLength },
        { x: center.x + crossX * halfLength, y: center.y + crossY * halfLength },
        lineColor,
        Z_DECORATION_LINE_STYLE.alpha,
        lineWeight,
      );
    };

    const innerAxisStart = baseDistance;
    const innerAxisEnd = innerAxisStart + axisLength;
    const longBarDistance = innerAxisEnd + gap;
    const shortBarDistance = longBarDistance + gap;
    const outerAxisStart = shortBarDistance + gap;
    drawAxisSegment(innerAxisStart, innerAxisEnd);
    drawCrossbar(longBarDistance, longBarHalf);
    drawCrossbar(shortBarDistance, shortBarHalf);
    drawAxisSegment(outerAxisStart, outerAxisStart + axisLength);
  });
}

// #endregion [F07]

// #region [F08] Lagrange-Inspired Main Nodes and Orbit Lines

function drawRadialFadeLine(point, angle, outerRadius, rgb, baseStyle, scale) {
  const context = drawingContext;
  const style = MAIN_NODE_FIELD_STYLE.rays;
  const middlePosition = clamp(style.middlePosition, 0.05, 0.95);
  const gradient = context.createLinearGradient(
    point.x,
    point.y,
    point.x + Math.cos(angle) * outerRadius,
    point.y + Math.sin(angle) * outerRadius,
  );
  const alphaToCss = (ratio) =>
    clamp(lineAlpha(baseStyle.alpha * ratio) / 255);
  gradient.addColorStop(
    0,
    `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alphaToCss(style.innerAlphaRatio)})`,
  );
  gradient.addColorStop(
    middlePosition,
    `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alphaToCss(style.middleAlphaRatio)})`,
  );
  gradient.addColorStop(
    1,
    `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alphaToCss(style.outerAlphaRatio)})`,
  );
  context.save();
  context.strokeStyle = gradient;
  context.lineWidth = Math.max(
    0.35,
    baseStyle.weight * style.weightRatio * scale * LINE_WEIGHT_GAIN,
  );
  context.beginPath();
  context.moveTo(point.x, point.y);
  context.lineTo(
    point.x + Math.cos(angle) * outerRadius,
    point.y + Math.sin(angle) * outerRadius,
  );
  context.stroke();
  context.restore();
}

function selectNearbyNeuralTargets(origin, layerA, layerB, style, fieldKey) {
  const candidates = [];
  layerA.forEach((point, index) => {
    if (style.excludeVerticalAxisNodes && index % 6 === 0) return;
    candidates.push({
      point,
      id: `A${index}`,
      distance: Math.hypot(point.x - origin.x, point.y - origin.y),
    });
  });
  layerB.forEach((point, index) => {
    if (style.excludeVerticalAxisNodes && index % 6 === 0) return;
    candidates.push({
      point,
      id: `B${index}`,
      distance: Math.hypot(point.x - origin.x, point.y - origin.y),
    });
  });

  candidates.sort((a, b) => a.distance - b.distance);
  const nearbyPool = candidates.slice(
    0,
    Math.max(style.count, Math.min(candidates.length, style.nearbyPoolSize)),
  );
  nearbyPool.sort((a, b) => {
    const scoreA = hash01(
      `${activeSignal.subjectId}:${fieldKey}:${a.id}:target`,
    );
    const scoreB = hash01(
      `${activeSignal.subjectId}:${fieldKey}:${b.id}:target`,
    );
    return scoreA - scoreB;
  });
  return nearbyPool.slice(0, style.count);
}

function drawNeuralTendrilBundle(
  origin,
  target,
  outerRingRadius,
  style,
  rgb,
  scale,
  fieldKey,
  targetId,
) {
  const context = drawingContext;
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const directionX = dx / distance;
  const directionY = dy / distance;
  const perpendicularX = -directionY;
  const perpendicularY = directionX;
  const curveStartDistance = Math.min(
    distance * 0.74,
    outerRingRadius * style.curveStartRatio,
  );
  const curveStart = {
    x: origin.x + directionX * curveStartDistance,
    y: origin.y + directionY * curveStartDistance,
  };
  const remaining = Math.max(1, distance - curveStartDistance);
  const strandCount = Math.max(1, Math.round(style.strandCount));

  for (let strand = 0; strand < strandCount; strand += 1) {
    const seed = `${activeSignal.subjectId}:${fieldKey}:${targetId}:${strand}`;
    const signedRandom = hash01(`${seed}:bend`) * 2 - 1;
    const bend = remaining * (
      style.bendRatio + Math.abs(signedRandom) * style.randomBendRatio
    ) * (signedRandom < 0 ? -1 : 1);
    const strandOffset = (
      strand - (strandCount - 1) * 0.5
    ) * style.strandSpread * scale;
    const control1 = {
      x: curveStart.x + directionX * remaining * 0.30
        + perpendicularX * (bend + strandOffset),
      y: curveStart.y + directionY * remaining * 0.30
        + perpendicularY * (bend + strandOffset),
    };
    const control2 = {
      x: target.x - directionX * remaining * 0.24
        - perpendicularX * (bend * 0.34 - strandOffset),
      y: target.y - directionY * remaining * 0.24
        - perpendicularY * (bend * 0.34 - strandOffset),
    };

    const gradient = context.createLinearGradient(
      origin.x,
      origin.y,
      target.x,
      target.y,
    );
    const cssColor = (alpha) =>
      `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(lineAlpha(alpha) / 255)})`;
    gradient.addColorStop(0, cssColor(style.innerAlpha));
    gradient.addColorStop(clamp(style.curveStartRatio), cssColor(style.innerAlpha * 0.78));
    gradient.addColorStop(1, cssColor(style.outerAlpha));

    context.save();
    context.strokeStyle = gradient;
    context.lineWidth = Math.max(
      0.35,
      style.weight * scale * LINE_WEIGHT_GAIN,
    );
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(origin.x, origin.y);
    context.lineTo(curveStart.x, curveStart.y);
    context.bezierCurveTo(
      control1.x,
      control1.y,
      control2.x,
      control2.y,
      target.x,
      target.y,
    );
    context.stroke();
    context.restore();
  }
}

function drawMainNodeField(
  point,
  nodeRadius,
  fieldStyle,
  palette,
  scale,
  neuralContext = null,
) {
  const ringStyle = DERIVED_LINE_STYLE.mainNodeField;
  const ringColor = palette[ringStyle.color];
  const firstRadius =
    nodeRadius * fieldStyle.firstRadiusMultiplier * scale
    + fieldStyle.firstRadiusGap * scale;
  const ringGap = fieldStyle.ringGap * scale;
  const outerRingRadius = firstRadius + (fieldStyle.ringCount - 1) * ringGap;
  const rayOuterRadius = outerRingRadius + fieldStyle.rayOvershoot * scale;

  const straightRayCount = fieldStyle.neuralTendrils
    ? Math.min(fieldStyle.rayCount, fieldStyle.straightRayCount)
    : fieldStyle.rayCount;
  for (let ray = 0; ray < straightRayCount; ray += 1) {
    const angle = -Math.PI / 2 + ray * (Math.PI * 2 / straightRayCount);
    drawRadialFadeLine(
      point,
      angle,
      rayOuterRadius,
      ringColor,
      ringStyle,
      scale,
    );
  }

  if (fieldStyle.neuralTendrils && neuralContext) {
    const tendrilStyle = fieldStyle.neuralTendrils;
    const targets = selectNearbyNeuralTargets(
      point,
      neuralContext.layerA,
      neuralContext.layerB,
      tendrilStyle,
      neuralContext.key,
    );
    targets.forEach((target) => {
      drawNeuralTendrilBundle(
        point,
        target.point,
        outerRingRadius,
        tendrilStyle,
        palette[tendrilStyle.color],
        scale,
        neuralContext.key,
        target.id,
      );
    });
  }

  noFill();
  for (let ring = 0; ring < fieldStyle.ringCount; ring += 1) {
    const radius = firstRadius + ring * ringGap;
    const ringProgress = ring / Math.max(1, fieldStyle.ringCount - 1);
    const fadeStyle = fieldStyle.ringFade;
    const ringOpacity = fadeStyle
      ? mix(
        fadeStyle.innerOpacity,
        fadeStyle.outerOpacity,
        Math.pow(ringProgress, Math.max(0.05, fadeStyle.power)),
      )
      : 1;
    const ringAlpha = ringStyle.alpha * clamp(ringOpacity);
    if (ring < fieldStyle.solidRingCount) {
      stroke(rgba(ringColor, lineAlpha(ringAlpha)));
      strokeWeight(ringStyle.weight * scale * LINE_WEIGHT_GAIN);
      circle(point.x, point.y, radius * 2);
    } else {
      drawDashedCircle(
        point,
        radius,
        ringColor,
        ringAlpha,
        ringStyle.weight,
        fieldStyle.dashLength,
        fieldStyle.dashGap,
        scale,
      );
    }
  }
}

function findExtremeNode(points, axis, comparison) {
  return points.reduce((selected, point) =>
    comparison(point[axis], selected[axis]) ? point : selected,
  );
}

function semanticNodeRadius(value, style) {
  const shapedValue = Math.pow(clamp(value), Math.max(0.05, style.power));
  return mix(style.min, style.max, shapedValue);
}

function buildLagrangeGeometry(layerB) {
  // Anchor four main nodes to the extreme B-layer points and derive the axes.
  const geometryStyle = LAGRANGE_GEOMETRY_STYLE;

  const l3 = findExtremeNode(layerB, "x", (value, selected) => value < selected);
  const rightAxisEnd = findExtremeNode(
    layerB,
    "x",
    (value, selected) => value > selected,
  );
  const l4 = findExtremeNode(layerB, "y", (value, selected) => value < selected);
  const l5 = findExtremeNode(layerB, "y", (value, selected) => value > selected);
  const axisDx = rightAxisEnd.x - l3.x;
  const axisDy = rightAxisEnd.y - l3.y;
  const fullAxisLength = Math.max(1, Math.hypot(axisDx, axisDy));
  const axisX = axisDx / fullAxisLength;
  const axisY = axisDy / fullAxisLength;
  const pointAlongAxis = (origin, distance) => ({
    x: origin.x + axisX * distance,
    y: origin.y + axisY * distance,
  });

  const insetDistance = fullAxisLength * clamp(geometryStyle.massInsetRatio, 0, 0.49);
  const m1 = pointAlongAxis(l3, insetDistance);
  const m2 = pointAlongAxis(rightAxisEnd, -insetDistance);
  return { l3, l4, l5, m1, m2, rightAxisEnd, layerB };
}

function drawStableRandomHorizontalPoints(l3, m1, m2, rightAxisEnd, scale) {
  const style = HORIZONTAL_RANDOM_POINT_STYLE;
  const subjectKey = activeSignal.subjectId;
  const countRange = Math.max(0, style.maxCount - style.minCount + 1);
  const segmentCount = (sideKey) => style.minCount
    + Math.floor(
      hash01(`${subjectKey}:axis-random-count:${sideKey}`) * countRange,
    );
  const leftCount = segmentCount("left");
  const rightCount = segmentCount("right");

  const drawSegmentPoints = (start, end, count, sideKey) => {
    for (let index = 0; index < count; index += 1) {
      const t = (index + 1) / (count + 1);
      const radius = mix(
        style.minRadius,
        style.maxRadius,
        hash01(`${subjectKey}:axis-random-size:${sideKey}:${index}`),
      );
      drawCoreOnlyNode(
        {
          x: mix(start.x, end.x, t),
          y: mix(start.y, end.y, t),
        },
        radius,
        scale,
      );
    }
  };

  drawSegmentPoints(l3, m1, leftCount, "left");
  drawSegmentPoints(m2, rightAxisEnd, rightCount, "right");
}

function drawLagrangeSystem(layerA, layerB, scale, geometry) {
  const palette = PALETTES[paletteName];
  const leftMass = clamp(currentState.faceConfidence);
  const rightMass = clamp(currentState.classificationCertainty);
  const genderCertainty = clamp(currentState.genderCertainty);
  const privilege = clamp(currentState.privilege);
  const rejection = 1 - privilege;
  const sizeStyle = SEMANTIC_NODE_SIZE_STYLE;
  const { l3, l4, l5, m1, m2, rightAxisEnd } = geometry;

  const structuralEdges = [
    [l3, m1], [m1, m2], [m2, rightAxisEnd],
    [l4, l5],
    [m1, l4], [m2, l4], [m1, l5], [m2, l5],
  ];
  structuralEdges.forEach(([a, b], index) => {
    const style = index < 3
      ? LAGRANGE_CONNECTION_STYLE.horizontalAxis
      : index === 3
        ? LAGRANGE_CONNECTION_STYLE.verticalAxis
        : LAGRANGE_CONNECTION_STYLE.fourMainNodes;
    drawOpenLine(
      a,
      b,
      palette[style.color],
      style.alpha,
      style.weight * scale,
    );
  });

  const m1Radius = semanticNodeRadius(leftMass, sizeStyle.m1FaceConfidence);
  const m2Radius = semanticNodeRadius(rightMass, sizeStyle.m2ClassificationCertainty);
  const l4Radius = semanticNodeRadius(privilege, sizeStyle.l4Privilege);
  const l5Radius = semanticNodeRadius(rejection, sizeStyle.l5Rejection);
  drawMainNodeField(
    m1,
    m1Radius,
    MAIN_NODE_FIELD_STYLE.horizontal,
    palette,
    scale,
    { layerA, layerB, key: "M1" },
  );
  drawMainNodeField(
    m2,
    m2Radius,
    MAIN_NODE_FIELD_STYLE.horizontal,
    palette,
    scale,
    { layerA, layerB, key: "M2" },
  );
  drawMainNodeField(
    l4,
    l4Radius,
    MAIN_NODE_FIELD_STYLE.vertical,
    palette,
    scale,
  );
  drawMainNodeField(
    l5,
    l5Radius,
    MAIN_NODE_FIELD_STYLE.vertical,
    palette,
    scale,
  );
  drawMainNode(m1, m1Radius, leftMass, scale, MASS_NODE_STYLE);
  drawMainNode(m2, m2Radius, rightMass, scale, MASS_NODE_STYLE);
  drawMainNode(l4, l4Radius, privilege, scale);
  drawMainNode(l5, l5Radius, rejection, scale);
  drawStableRandomHorizontalPoints(
    l3,
    m1,
    m2,
    rightAxisEnd,
    scale,
  );
  drawHorizontalNode(l3, semanticNodeRadius(genderCertainty, sizeStyle.l3GenderCertainty), scale);
}

function drawClassificationCore(cx, cy, radius, scale) {
  // DeepFace race probabilities form the irregular six-sided central polygon.
  const palette = PALETTES[paletteName];
  const rotationStyle = CLASSIFICATION_CORE_STYLE.rotation;
  const elapsed = currentMotionFrame?.elapsed ?? 0;
  const turnAngle = rotationStyle.enabled
    ? radians(rotationStyle.startAngleDegrees)
      + elapsed * Math.PI * 2
        / Math.max(0.1, rotationStyle.cycleSeconds)
        * Math.sign(rotationStyle.direction || 1)
    : radians(rotationStyle.startAngleDegrees);
  const axisAngle = radians(rotationStyle.axisAngleDegrees)
    + (rotationStyle.enabled
      ? elapsed * Math.PI * 2
        / Math.max(0.1, rotationStyle.axisCycleSeconds)
        * Math.sign(rotationStyle.axisDirection || 1)
      : 0);
  const points = buildClassificationPoints(
    cx,
    cy,
    radius,
    axisAngle,
    turnAngle,
    rotationStyle.perspectiveStrength,
  );
  const polygonStyle = CLASSIFICATION_CORE_STYLE.polygon;
  drawClosedPath(
    points,
    palette[polygonStyle.color],
    polygonStyle.alpha,
    polygonStyle.weight * scale,
  );
  points.forEach((point, index) => {
    const probabilityValue = currentState.race[index];
    const depthScale = clamp(point.perspectiveScale, 0.78, 1.28);
    drawCoreOnlyNode(
      point,
      (1.7 + probabilityValue * 3.8) * depthScale,
      scale,
    );
  });

  const verdictStrength =
    clamp(currentState.faceConfidence)
    * clamp(currentState.classificationCertainty)
    * clamp(currentState.privilege);
  drawCenterNode(
    { x: cx, y: cy },
    semanticNodeRadius(
      verdictStrength,
      SEMANTIC_NODE_SIZE_STYLE.centerVerdict,
    ),
    scale,
  );
}

// #endregion [F08]

// #region [F09] Exhibition Frame, Data Readouts and Screen Effects

function canvasRgba(rgb, alpha255) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamp(alpha255 / 255)})`;
}

function fillDepthFramePlane(
  points,
  gradientStart,
  gradientEnd,
  outerRgb,
  innerRgb,
  outerAlpha,
  innerAlpha,
) {
  const context = drawingContext;
  const gradient = context.createLinearGradient(
    gradientStart.x,
    gradientStart.y,
    gradientEnd.x,
    gradientEnd.y,
  );
  gradient.addColorStop(0, canvasRgba(outerRgb, outerAlpha));
  gradient.addColorStop(1, canvasRgba(innerRgb, innerAlpha));
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.closePath();
  context.fill();
}

function getScreenDepthFrameGeometry(frame, scale) {
  const style = SCREEN_DEPTH_FRAME_STYLE;
  const outerInset = style.outerInset * scale;
  const cornerAngle = radians(clamp(style.cornerAngleDegrees, 5, 85));
  const cornerSlope = Math.max(0.0001, Math.tan(cornerAngle));

  const sideDepthX = Math.min(
    style.layers.sides.depth * scale,
    frame.width * 0.12,
  );
  const sideCrossY = Math.min(
    sideDepthX * cornerSlope,
    frame.height * 0.14,
  );

  const topBottomDepthY = Math.min(
    style.layers.topBottom.depth * scale,
    frame.height * 0.14,
  );
  const topBottomCrossX = Math.min(
    topBottomDepthY / cornerSlope,
    frame.width * 0.12,
  );
  const outer = {
    left: frame.x + outerInset,
    top: frame.y + outerInset,
    right: frame.x + frame.width - outerInset,
    bottom: frame.y + frame.height - outerInset,
  };
  const topBottomInner = {
    left: outer.left + topBottomCrossX,
    top: outer.top + topBottomDepthY,
    right: outer.right - topBottomCrossX,
    bottom: outer.bottom - topBottomDepthY,
  };
  const sideInner = {
    left: outer.left + sideDepthX,
    top: outer.top + sideCrossY,
    right: outer.right - sideDepthX,
    bottom: outer.bottom - sideCrossY,
  };
  return {
    outer,
    topBottomInner,
    sideInner,
    inner: {
      left: outer.left + sideDepthX,
      top: outer.top + topBottomDepthY,
      right: outer.right - sideDepthX,
      bottom: outer.bottom - topBottomDepthY,
    },
  };
}

function getScreenOverlayFrameBounds(frame, scale, outerBounds = null) {
  const style = SCREEN_DEPTH_FRAME_STYLE;
  const outer = outerBounds ?? getScreenDepthFrameGeometry(frame, scale).outer;
  const overlayInset = Math.min(
    style.overlayFrame.inset * scale,
    frame.width * 0.22,
    frame.height * 0.12,
  );
  return {
    left: outer.left + overlayInset,
    top: outer.top + overlayInset,
    right: outer.right - overlayInset,
    bottom: outer.bottom - overlayInset,
  };
}

function getConstrainedAstrolabeRadius(frame, cx, cy, scale) {
  // Fit both wide and narrow plates inside the frame's protected content area.
  const astrolabeStyle = EXHIBITION_LAYOUT_STYLE.astrolabe;
  const idealRadius = frame.width * astrolabeStyle.radiusToFrameWidth;
  if (!SCREEN_DEPTH_FRAME_STYLE.enabled) return idealRadius;

  const { inner } = getScreenDepthFrameGeometry(frame, scale);
  const clearance = SCREEN_DEPTH_FRAME_STYLE.contentClearance * scale;
  const availableRoom = {
    left: Math.max(0, cx - inner.left - clearance),
    right: Math.max(0, inner.right - cx - clearance),
    top: Math.max(0, cy - inner.top - clearance),
    bottom: Math.max(0, inner.bottom - cy - clearance),
  };

  const contourScale = 1.015;
  const normalizedOuter = buildOuterPoints(0, 0, 1);
  const maximumExtent = normalizedOuter.reduce(
    (result, point) => Math.max(
      result,
      Math.hypot(point.x, point.y) * contourScale,
    ),
    0,
  );
  const minimumRoom = Math.min(
    availableRoom.left,
    availableRoom.right,
    availableRoom.top,
    availableRoom.bottom,
  );
  const fittedRadius = Math.max(
    0,
    minimumRoom / Math.max(0.0001, maximumExtent),
  );

  if (fittedRadius <= idealRadius) return fittedRadius;
  const fitStyle = astrolabeStyle.dynamicFit;
  const maximumRadius = frame.width * fitStyle.maximumRadiusToFrameWidth;
  return mix(
    idealRadius,
    Math.min(fittedRadius, maximumRadius),
    clamp(fitStyle.expansionStrength),
  );
}

function stableFrameLineWidth(rawWidth) {
  const density = Math.max(1, Number(pixelDensity()) || 1);
  const physicalWidth = Math.max(1, Math.round(rawWidth * density));
  return physicalWidth / density;
}

function stableFrameCoordinate(value, lineWidth) {
  const density = Math.max(1, Number(pixelDensity()) || 1);
  const physicalWidth = Math.max(1, Math.round(lineWidth * density));
  const halfPixelOffset = physicalWidth % 2 === 1 ? 0.5 : 0;
  return (
    Math.round(value * density - halfPixelOffset) + halfPixelOffset
  ) / density;
}

function drawStableFrameLine(context, x1, y1, x2, y2, rgb, alpha, rawWidth) {
  const lineWidth = stableFrameLineWidth(rawWidth);
  let startX = x1;
  let startY = y1;
  let endX = x2;
  let endY = y2;

  if (Math.abs(y2 - y1) < 0.0001) {
    const snappedY = stableFrameCoordinate(y1, lineWidth);
    startY = snappedY;
    endY = snappedY;
  } else if (Math.abs(x2 - x1) < 0.0001) {
    const snappedX = stableFrameCoordinate(x1, lineWidth);
    startX = snappedX;
    endX = snappedX;
  }

  context.strokeStyle = canvasRgba(rgb, alpha);
  context.lineWidth = lineWidth;
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
}

function drawScreenDepthFrame(frame, scale, palette) {
  const style = SCREEN_DEPTH_FRAME_STYLE;
  if (!style.enabled) return;

  const {
    outer,
    topBottomInner,
    sideInner,
  } = getScreenDepthFrameGeometry(frame, scale);
  const outerCorners = [
    { x: outer.left, y: outer.top },
    { x: outer.right, y: outer.top },
    { x: outer.right, y: outer.bottom },
    { x: outer.left, y: outer.bottom },
  ];
  const topBottomInnerCorners = [
    { x: topBottomInner.left, y: topBottomInner.top },
    { x: topBottomInner.right, y: topBottomInner.top },
    { x: topBottomInner.right, y: topBottomInner.bottom },
    { x: topBottomInner.left, y: topBottomInner.bottom },
  ];
  const sideInnerCorners = [
    { x: sideInner.left, y: sideInner.top },
    { x: sideInner.right, y: sideInner.top },
    { x: sideInner.right, y: sideInner.bottom },
    { x: sideInner.left, y: sideInner.bottom },
  ];
  const plane = style.plane;
  const outerPlaneRgb = palette[plane.outerColor];
  const innerPlaneRgb = palette[plane.innerColor];
  const context = drawingContext;

  push();
  context.save();
  context.globalAlpha *= clamp(style.opacity);
  context.globalCompositeOperation = style.blendMode;
  context.lineCap = "square";
  context.lineJoin = "miter";

  fillDepthFramePlane(
    [
      outerCorners[0],
      outerCorners[1],
      topBottomInnerCorners[1],
      topBottomInnerCorners[0],
    ],
    { x: 0, y: outer.top },
    { x: 0, y: topBottomInner.top },
    outerPlaneRgb,
    innerPlaneRgb,
    plane.outerAlpha,
    plane.innerAlpha,
  );
  fillDepthFramePlane(
    [
      outerCorners[3],
      topBottomInnerCorners[3],
      topBottomInnerCorners[2],
      outerCorners[2],
    ],
    { x: 0, y: outer.bottom },
    { x: 0, y: topBottomInner.bottom },
    outerPlaneRgb,
    innerPlaneRgb,
    plane.outerAlpha,
    plane.innerAlpha,
  );
  fillDepthFramePlane(
    [
      outerCorners[0],
      sideInnerCorners[0],
      sideInnerCorners[3],
      outerCorners[3],
    ],
    { x: outer.left, y: 0 },
    { x: sideInner.left, y: 0 },
    outerPlaneRgb,
    innerPlaneRgb,
    plane.outerAlpha,
    plane.innerAlpha,
  );
  fillDepthFramePlane(
    [
      outerCorners[1],
      outerCorners[2],
      sideInnerCorners[2],
      sideInnerCorners[1],
    ],
    { x: outer.right, y: 0 },
    { x: sideInner.right, y: 0 },
    outerPlaneRgb,
    innerPlaneRgb,
    plane.outerAlpha,
    plane.innerAlpha,
  );

  const layerStyle = style.layers;
  noFill();
  const topBottomStyle = layerStyle.topBottom;
  const topBottomCount = Math.max(1, Math.round(topBottomStyle.count));
  for (let index = 0; index < topBottomCount; index += 1) {
    const linearProgress = (index + 1) / (topBottomCount + 1);
    const progress = Math.pow(linearProgress, topBottomStyle.spacingPower);
    const fadeProgress = Math.pow(linearProgress, topBottomStyle.fadePower);
    const left = mix(outer.left, topBottomInner.left, progress);
    const top = mix(outer.top, topBottomInner.top, progress);
    const right = mix(outer.right, topBottomInner.right, progress);
    const bottom = mix(outer.bottom, topBottomInner.bottom, progress);
    const layerAlpha = mix(
      layerStyle.outerAlpha,
      topBottomStyle.innerAlpha,
      fadeProgress,
    );
    const layerWeight = mix(
      topBottomStyle.outerWeight,
      topBottomStyle.innerWeight,
      linearProgress,
    ) * scale * LINE_WEIGHT_GAIN;
    drawStableFrameLine(
      context,
      left,
      top,
      right,
      top,
      palette[layerStyle.color],
      layerAlpha,
      layerWeight,
    );
    drawStableFrameLine(
      context,
      left,
      bottom,
      right,
      bottom,
      palette[layerStyle.color],
      layerAlpha,
      layerWeight,
    );
  }

  const sideStyle = layerStyle.sides;
  const sideCount = Math.max(1, Math.round(sideStyle.count));
  for (let index = 0; index < sideCount; index += 1) {
    const linearProgress = (index + 1) / (sideCount + 1);
    const progress = Math.pow(linearProgress, sideStyle.spacingPower);
    const fadeProgress = Math.pow(linearProgress, sideStyle.fadePower);
    const left = mix(outer.left, sideInner.left, progress);
    const top = mix(outer.top, sideInner.top, progress);
    const right = mix(outer.right, sideInner.right, progress);
    const bottom = mix(outer.bottom, sideInner.bottom, progress);
    const layerAlpha = mix(
      layerStyle.outerAlpha,
      sideStyle.innerAlpha,
      fadeProgress,
    );
    const layerWeight = mix(
      sideStyle.outerWeight,
      sideStyle.innerWeight,
      linearProgress,
    ) * scale * LINE_WEIGHT_GAIN;
    drawStableFrameLine(
      context,
      left,
      top,
      left,
      bottom,
      palette[layerStyle.color],
      layerAlpha,
      layerWeight,
    );
    drawStableFrameLine(
      context,
      right,
      top,
      right,
      bottom,
      palette[layerStyle.color],
      layerAlpha,
      layerWeight,
    );
  }

  const overlayStyle = style.overlayFrame;
  const overlay = getScreenOverlayFrameBounds(frame, scale, outer);
  const cornerStyle = overlayStyle.corner;
  const horizontalLength = Math.min(
    cornerStyle.horizontalLength * scale,
    (overlay.right - overlay.left) * 0.22,
  );
  const verticalLength = Math.min(
    cornerStyle.verticalLength * scale,
    (overlay.bottom - overlay.top) * 0.16,
  );
  const gap = cornerStyle.gap * scale;
  const edgeStyle = overlayStyle.edge;

  context.shadowBlur = 0;
  const edgeWeight = edgeStyle.weight * scale * LINE_WEIGHT_GAIN;
  drawStableFrameLine(
    context,
    overlay.left + horizontalLength + gap,
    overlay.top,
    overlay.right - horizontalLength - gap,
    overlay.top,
    palette[edgeStyle.color],
    edgeStyle.alpha,
    edgeWeight,
  );
  drawStableFrameLine(
    context,
    overlay.left + horizontalLength + gap,
    overlay.bottom,
    overlay.right - horizontalLength - gap,
    overlay.bottom,
    palette[edgeStyle.color],
    edgeStyle.alpha,
    edgeWeight,
  );
  drawStableFrameLine(
    context,
    overlay.left,
    overlay.top + verticalLength + gap,
    overlay.left,
    overlay.bottom - verticalLength - gap,
    palette[edgeStyle.color],
    edgeStyle.alpha,
    edgeWeight,
  );
  drawStableFrameLine(
    context,
    overlay.right,
    overlay.top + verticalLength + gap,
    overlay.right,
    overlay.bottom - verticalLength - gap,
    palette[edgeStyle.color],
    edgeStyle.alpha,
    edgeWeight,
  );

  const cornerSegments = [
    [overlay.left, overlay.top, overlay.left + horizontalLength, overlay.top],
    [overlay.left, overlay.top, overlay.left, overlay.top + verticalLength],
    [overlay.right - horizontalLength, overlay.top, overlay.right, overlay.top],
    [overlay.right, overlay.top, overlay.right, overlay.top + verticalLength],
    [overlay.right - horizontalLength, overlay.bottom, overlay.right, overlay.bottom],
    [overlay.right, overlay.bottom - verticalLength, overlay.right, overlay.bottom],
    [overlay.left, overlay.bottom, overlay.left + horizontalLength, overlay.bottom],
    [overlay.left, overlay.bottom - verticalLength, overlay.left, overlay.bottom],
  ];
  const cornerWeight = cornerStyle.weight * scale * LINE_WEIGHT_GAIN;
  const cornerGlowWeight = cornerWeight + cornerStyle.glowBlur * scale * 0.72;
  cornerSegments.forEach((segment) => {
    drawStableFrameLine(
      context,
      ...segment,
      palette[cornerStyle.glowColor],
      cornerStyle.glowAlpha * 0.46,
      cornerGlowWeight,
    );
  });
  cornerSegments.forEach((segment) => {
    drawStableFrameLine(
      context,
      ...segment,
      palette[cornerStyle.color],
      cornerStyle.alpha,
      cornerWeight,
    );
  });

  const outerStyle = style.outerBorder;
  const outerSegments = [
    [outer.left, outer.top, outer.right, outer.top],
    [outer.right, outer.top, outer.right, outer.bottom],
    [outer.right, outer.bottom, outer.left, outer.bottom],
    [outer.left, outer.bottom, outer.left, outer.top],
  ];
  const outerWeight = outerStyle.weight * scale * LINE_WEIGHT_GAIN;
  const outerGlowWeight = outerWeight + outerStyle.glowBlur * scale * 0.72;
  outerSegments.forEach((segment) => {
    drawStableFrameLine(
      context,
      ...segment,
      palette[outerStyle.glowColor],
      outerStyle.glowAlpha * 0.42,
      outerGlowWeight,
    );
  });
  outerSegments.forEach((segment) => {
    drawStableFrameLine(
      context,
      ...segment,
      palette[outerStyle.color],
      outerStyle.alpha,
      outerWeight,
    );
  });

  context.restore();
  pop();
}

function getExhibitionFrame() {
  const targetAspect =
    EXHIBITION_LAYOUT_STYLE.aspectWidth / EXHIBITION_LAYOUT_STYLE.aspectHeight;
  let frameWidth = width;
  let frameHeight = frameWidth / targetAspect;
  if (frameHeight > height) {
    frameHeight = height;
    frameWidth = frameHeight * targetAspect;
  }
  return {
    x: (width - frameWidth) * 0.5,
    y: (height - frameHeight) * 0.5,
    width: frameWidth,
    height: frameHeight,
    scale: frameWidth / 1080,
  };
}

function normalizedCategoryEntries(source, keys, labels = keys) {
  const rawValues = keys.map((key) => probability(source?.[key] ?? 0));
  const total = rawValues.reduce((sum, value) => sum + value, 0);
  const safeTotal = total > 1e-8 ? total : 1;
  return keys.map((key, index) => ({
    key,
    label: labels[index],
    value: rawValues[index] / safeTotal,
  }));
}

function dominantCategoryIndex(entries) {
  return entries.reduce(
    (selected, entry, index) =>
      entry.value > entries[selected].value ? index : selected,
    0,
  );
}

function roundedRectPath(context, x, y, rectWidth, rectHeight, radius) {
  const safeRadius = Math.max(
    0,
    Math.min(radius, rectWidth * 0.5, rectHeight * 0.5),
  );
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + rectWidth - safeRadius, y);
  context.quadraticCurveTo(x + rectWidth, y, x + rectWidth, y + safeRadius);
  context.lineTo(x + rectWidth, y + rectHeight - safeRadius);
  context.quadraticCurveTo(
    x + rectWidth,
    y + rectHeight,
    x + rectWidth - safeRadius,
    y + rectHeight,
  );
  context.lineTo(x + safeRadius, y + rectHeight);
  context.quadraticCurveTo(x, y + rectHeight, x, y + rectHeight - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function drawReadoutMarker(x, barCenterY, scale, palette) {
  const style = DATA_READOUT_STYLE;
  const markerWidth = style.markerWidth * scale;
  const markerHeight = style.markerHeight * scale;
  const barHeight = style.barHeight * scale;
  const context = drawingContext;
  const rgb = palette[style.marker.color];
  context.save();
  context.globalAlpha *= style.marker.alpha / 255;
  context.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  context.shadowColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.82)`;
  context.shadowBlur = style.markerGlow * scale;
  context.beginPath();
  context.moveTo(x - markerWidth * 0.5, barCenterY - barHeight * 0.5 - markerHeight);
  context.lineTo(x + markerWidth * 0.5, barCenterY - barHeight * 0.5 - markerHeight);
  context.lineTo(x, barCenterY + barHeight * 0.46);
  context.closePath();
  context.fill();
  context.restore();
}

function drawRecognitionReadout({
  title,
  valueLabel,
  entries,
  markerPosition,
}, x, barCenterY, barWidth, scale, palette) {
  // Display model outputs as measurements, not as verified identity labels.
  const style = DATA_READOUT_STYLE;
  const context = drawingContext;
  const barHeight = style.barHeight * scale;
  const barTop = barCenterY - barHeight * 0.5;
  const radius = barHeight * 0.5;
  const segmentWidth = barWidth / Math.max(1, entries.length);

  const trackRgb = palette[style.track.color];
  context.save();
  roundedRectPath(context, x, barTop, barWidth, barHeight, radius);
  context.fillStyle = `rgba(${trackRgb[0]},${trackRgb[1]},${trackRgb[2]},${style.track.alpha / 255})`;
  context.fill();
  context.clip();

  entries.forEach((_entry, index) => {
    const rgb = palette[style.segment.color];
    const alpha = style.segment.alpha / 255;
    context.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
    context.fillRect(
      x + index * segmentWidth,
      barTop,
      segmentWidth + 0.5,
      barHeight,
    );
  });
  context.restore();

  const outlineRgb = palette[style.outline.color];
  context.save();
  roundedRectPath(context, x, barTop, barWidth, barHeight, radius);
  context.strokeStyle = `rgba(${outlineRgb[0]},${outlineRgb[1]},${outlineRgb[2]},${style.outline.alpha / 255})`;
  context.lineWidth = Math.max(0.45, style.outlineWeight * scale);
  context.stroke();

  const dividerRgb = palette[style.divider.color];
  context.strokeStyle = `rgba(${dividerRgb[0]},${dividerRgb[1]},${dividerRgb[2]},${style.divider.alpha / 255})`;
  context.lineWidth = Math.max(0.4, 0.6 * scale);
  for (let index = 1; index < entries.length; index += 1) {
    const dividerX = x + index * segmentWidth;
    context.beginPath();
    context.moveTo(dividerX, barTop + barHeight * 0.16);
    context.lineTo(dividerX, barTop + barHeight * 0.84);
    context.stroke();
  }
  context.restore();

  push();
  textFont("monospace");
  noStroke();
  textSize(style.titleSize * scale);
  textAlign(LEFT, BOTTOM);
  const labelRgb = palette[style.label.color];
  fill(labelRgb[0], labelRgb[1], labelRgb[2], style.label.alpha);
  text(title, x, barTop - 8 * scale);
  textAlign(RIGHT, BOTTOM);
  textSize(style.valueSize * scale);
  const activeRgb = palette[style.activeLabel.color];
  fill(activeRgb[0], activeRgb[1], activeRgb[2], style.activeLabel.alpha);
  text(valueLabel, x + barWidth, barTop - 8 * scale);

  textSize(style.categorySize * scale);
  entries.forEach((entry, index) => {
    const rgb = palette[style.label.color];
    fill(rgb[0], rgb[1], rgb[2], style.label.alpha);
    textAlign(CENTER, TOP);
    text(
      entry.label,
      x + (index + 0.5) * segmentWidth,
      barTop + barHeight + 7 * scale,
    );
  });
  pop();

  drawReadoutMarker(
    x + clamp(markerPosition) * barWidth,
    barCenterY,
    scale,
    palette,
  );
}

function buildNumericReadoutScale(scaleStyle) {
  const minimum = Number(scaleStyle?.minimum) || 0;
  const maximum = Math.max(minimum + 0.0001, Number(scaleStyle?.maximum) || 100);
  const tickCount = Math.max(2, Math.round(scaleStyle?.tickCount || 5));
  return Array.from({ length: tickCount }, (_unused, index) => {
    const progress = index / (tickCount - 1);
    const value = mix(minimum, maximum, progress);
    return {
      label: Number.isInteger(value) ? String(value) : value.toFixed(1),
      value: 0.35 + progress * 0.40,
    };
  });
}

function normalizeReadoutValueToScale(value, scaleStyle) {
  const minimum = Number(scaleStyle?.minimum) || 0;
  const maximum = Math.max(minimum + 0.0001, Number(scaleStyle?.maximum) || 100);
  return clamp((value - minimum) / (maximum - minimum));
}

function buildRecognitionReadouts() {
  const genderEntries = normalizedCategoryEntries(
    activeSignal.gender,
    ["Man", "Woman"],
    ["MAN", "WOMAN"],
  );
  const raceEntries = normalizedCategoryEntries(
    activeSignal.race,
    RACE_ORDER,
    ["ASIAN", "INDIAN", "BLACK", "WHITE", "M.EAST", "LATINO"],
  );
  const emotionKeys = ["neutral", "happy", "sad", "angry", "surprise"];
  const emotionEntries = normalizedCategoryEntries(
    activeSignal.emotion,
    emotionKeys,
    ["NEUTRAL", "HAPPY", "SAD", "ANGRY", "SURPRISE"],
  );
  const genderDominant = dominantCategoryIndex(genderEntries);
  const raceDominant = dominantCategoryIndex(raceEntries);
  const emotionDominant = dominantCategoryIndex(emotionEntries);
  const womanProbability = genderEntries[1].value;
  const ageValue = clamp(activeSignal.age / 100);
  const detectionValue = probability(activeSignal.faceConfidence);
  const detectionPercent = detectionValue * 100;
  const detectionScale = DATA_READOUT_STYLE.detectionScale;

  return [
    {
      title: "GENDER",
      valueLabel: `${genderEntries[genderDominant].label}  ${(genderEntries[genderDominant].value * 100).toFixed(1)}%`,
      entries: genderEntries,
      markerPosition: womanProbability,
    },
    {
      title: "RACE",
      valueLabel: `${raceEntries[raceDominant].label}  ${(raceEntries[raceDominant].value * 100).toFixed(1)}%`,
      entries: raceEntries,
      markerPosition: (raceDominant + 0.5) / raceEntries.length,
    },
    {
      title: "EMOTION",
      valueLabel: `${emotionEntries[emotionDominant].label}  ${(emotionEntries[emotionDominant].value * 100).toFixed(1)}%`,
      entries: emotionEntries,
      markerPosition: (emotionDominant + 0.5) / emotionEntries.length,
    },
    {
      title: "AGE",
      valueLabel: `${Math.round(activeSignal.age)} YEARS`,
      entries: [
        { label: "0", value: 0.35 },
        { label: "25", value: 0.45 },
        { label: "50", value: 0.55 },
        { label: "75", value: 0.65 },
        { label: "100", value: 0.75 },
      ],
      markerPosition: ageValue,
    },
    {
      title: "DETECTION",
      valueLabel: `${detectionPercent.toFixed(1)}%`,
      entries: buildNumericReadoutScale(detectionScale),
      markerPosition: normalizeReadoutValueToScale(
        detectionPercent,
        detectionScale,
      ),
    },
  ];
}

function drawRecognitionReadouts(frame, scale, palette) {
  const layout = EXHIBITION_LAYOUT_STYLE.readouts;
  const x = frame.x + frame.width * layout.leftRatio;
  const barWidth = frame.width * layout.widthRatio;
  const firstRowY = frame.y + frame.height * layout.firstRowYRatio;
  const rowGap = frame.height * layout.rowGapRatio;
  const markerStyle = MOTION_STYLE.readoutMarker;
  buildRecognitionReadouts().forEach((readout, index) => {
    if (!Number.isFinite(readoutMarkerPositions[index])) {
      readoutMarkerPositions[index] = markerStyle.initialPosition;
    }
    const response = Math.max(0.05, markerStyle.responseSeconds);
    const amount = 1 - Math.exp(
      -(currentMotionFrame?.deltaSeconds ?? 0.016) / response,
    );
    readoutMarkerPositions[index] = mix(
      readoutMarkerPositions[index],
      clamp(readout.markerPosition),
      amount,
    );
    drawRecognitionReadout(
      {
        ...readout,
        markerPosition: readoutMarkerPositions[index],
      },
      x,
      firstRowY + index * rowGap,
      barWidth,
      scale,
      palette,
    );
  });
}

function drawScreenScanLine(frame, scale, palette) {
  const style = SCREEN_SCAN_LINE_STYLE;
  if (!style.enabled) return;

  const initialDelaySeconds = Math.max(0, style.initialDelaySeconds);
  const elapsedSeconds = currentMotionFrame?.elapsed ?? 0;
  if (elapsedSeconds < initialDelaySeconds) return;

  const pauseSeconds = Math.max(0, style.pauseSeconds);
  const travelSeconds = Math.max(0.1, style.travelSeconds);
  const cycleSeconds = pauseSeconds + travelSeconds;
  const cycleTime = (elapsedSeconds - initialDelaySeconds) % cycleSeconds;
  if (cycleTime >= travelSeconds) return;

  const progress = clamp(cycleTime / travelSeconds);
  const fadeIn = clamp(progress / Math.max(0.001, style.fadeInRatio));
  const fadeOut = clamp((1 - progress) / Math.max(0.001, style.fadeOutRatio));
  const visibility = Math.min(fadeIn, fadeOut);
  if (visibility <= 0.001) return;

  const rgb = palette[style.color];
  const inset = style.horizontalInset * scale;
  const x1 = frame.x + inset;
  const x2 = frame.x + frame.width - inset;
  const y = frame.y + frame.height * progress;
  const edgeFade = clamp(style.edgeFadeRatio, 0, 0.48);
  const context = drawingContext;
  const lineGradient = context.createLinearGradient(x1, y, x2, y);
  const glowGradient = context.createLinearGradient(x1, y, x2, y);
  const colorAt = (opacity) =>
    `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(opacity)})`;
  const lineOpacity = style.alpha / 255 * visibility;
  const glowOpacity = style.glow.alpha / 255 * visibility;

  lineGradient.addColorStop(0, colorAt(0));
  lineGradient.addColorStop(edgeFade, colorAt(lineOpacity));
  lineGradient.addColorStop(1 - edgeFade, colorAt(lineOpacity));
  lineGradient.addColorStop(1, colorAt(0));
  glowGradient.addColorStop(0, colorAt(0));
  glowGradient.addColorStop(edgeFade, colorAt(glowOpacity * 0.30));
  glowGradient.addColorStop(0.5, colorAt(glowOpacity));
  glowGradient.addColorStop(1 - edgeFade, colorAt(glowOpacity * 0.30));
  glowGradient.addColorStop(1, colorAt(0));

  context.save();
  context.beginPath();
  context.rect(frame.x, frame.y, frame.width, frame.height);
  context.clip();
  context.globalCompositeOperation = style.blendMode;

  context.strokeStyle = glowGradient;
  context.lineWidth = Math.max(
    1,
    style.weight * style.glow.widthMultiplier * scale * LINE_WEIGHT_GAIN,
  );
  context.shadowColor = colorAt(glowOpacity);
  context.shadowBlur = style.glow.blur * scale;
  context.beginPath();
  context.moveTo(x1, y);
  context.lineTo(x2, y);
  context.stroke();

  context.strokeStyle = lineGradient;
  context.lineWidth = Math.max(0.5, style.weight * scale * LINE_WEIGHT_GAIN);
  context.shadowColor = colorAt(glowOpacity);
  context.shadowBlur = style.glow.blur * scale * 0.55;
  context.beginPath();
  context.moveTo(x1, y);
  context.lineTo(x2, y);
  context.stroke();
  context.restore();
}

function drawDebugText() {
  if (!showDebug) return;
  const palette = PALETTES[paletteName];
  noStroke();
  fill(palette.copper[0], palette.copper[1], palette.copper[2], 185);
  textFont("monospace");
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text(
    `${activeSignal.subjectId}   ${idleAttractMode ? "IDLE" : simulationMode ? "SIMULATION" : liveLockState.toUpperCase()}   STYLE:${paletteName.toUpperCase()}   PRIVILEGE:${currentState.privilege.toFixed(3)}`,
    24,
    height - 20,
  );
}

// #endregion [F09]
