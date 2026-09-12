/*
 * Algorithmic Privilege Oracle Card
 *
 * This critical interface turns selected classifier outputs into fictional
 * "privilege" cards grounded in published audits of automated systems. The
 * cards expose structural bias; they do not validate race or gender prediction
 * as objective truth. Visual settings, evidence, selection, and drawing are
 * separated below so each responsibility can be reviewed independently.
 */

// #region [CARD P01] Visual Configuration

const PRIVILEGE_CARD_STYLE = {
  // Each subsection controls one independent visual system: card layout, captured
  // plate fragment, typography, title frame, reveal timing, and render caching.
  layout: {
    widthRatio: 0.72,
    maximumHeightRatio: 0.74,
    aspectRatio: 0.58,
    centerYRatio: 0.49,
    cornerCut: 26,
  },

  backdrop: {
    color: [0, 0, 0],
    alpha: 0.74,
  },

  surface: {
    topColor: [7, 4, 9],
    bottomColor: [1, 1, 2],
    alpha: 0.985,
  },

  border: {
    count: 5,
    outerInset: 3.4,
    gaps: [6.9, 7.5, 9.2, 7.0],
    colors: [
      [216, 103, 73],
      [209, 106, 71], // #D16A47
      [157, 55, 38],  // #9D3726
      [129, 52, 42],  // #81342A
      [120, 47, 31],
    ],
    alphas: [1.00, 1.00, 1.00, 1.00, 1.00],
    weights: [1.45, 1.45, 0.80, 1.45, 1.00],
  },

  chartFragment: {
    centerXRatio: 0.935,
    centerYRatio: 0.285,
    radiusToCardWidth: 0.74,
    sourcePaddingRatio: 0.16,
    sourceMinimumPadding: 28,
    snapshotResolutionScale: 1.0,
    orange: [236, 75, 20],
    amber: [255, 183, 91],
    red: [143, 28, 14],
    purple: [135, 59, 134],
    purpleDeep: [54, 20, 78],
  },

  typography: {
    header: {
      font: '"Big Shoulders Display", "Arial Narrow", sans-serif',
      size: 28,
      weight: 400,
      xRatio: 0.075,
      yRatio: 0.075,
      tracking: 1.4,
      wordSpacing: 0,
      color: [255, 217, 174],
      opacity: 0.92,
    },

    eyebrow: {
      font: '"AIzaozichunfeng", "字体家AI造字春风", sans-serif',
      size: 26.5,
      xRatio: 0.50,
      yRatio: 0.515,
      weight: 400,
      tracking: 1.0,
      wordSpacing: 0.0,
      color: [242, 188, 127],
      opacity: 1.0,
      alignToFrameTop: true,
      frameCenterOffset: 0,
      glow: {
        color: [228, 75, 21],
        alpha: 0.72,
        blur: 95,
      },
    },

    title: {
      font: '"Big Shoulders Display", "Arial Narrow", sans-serif',
      size: 63,
      xRatio: 0.50,
      yRatio: 0.609,
      weight: 300,
      tracking: 8.8,
      wordSpacing: 0,
      opacity: 1.00,
      color: [244, 187, 129], // #F4BB81
      glow: {
        color: [228, 75, 21],
        alpha: 0.72,
        blur: 100,
      },
    },

    verdict: {
      font: '"AIzaozichunfeng", sans-serif',
      size: 27,
      weight: 200,
      xRatio: 0.50,
      yRatio: 0.690,
      widthRatio: 0.72,
      lineHeight: 1.30,
      tracking: 1.65,
      wordSpacing: 0,
      color: [255, 201, 144],
      opacity: 0.94,
    },

    receipt: {
      xRatio: 0.13,
      yRatio: 0.755,
      widthRatio: 0.74,
      heightRatio: 0.088,
      frameColor: [221, 91, 42],
      frameOpacity: 0.68,
      frameWeight: 0.62,
      cornerCut: 12,
      cornerConcavity: 0.85,
      dividerRatio: 0.50,

      top: {
        font: '"AIzaozichunfeng", "字体家AI造字春风", sans-serif',
        size: 25,
        weight: 400,
        color: [221, 91, 42],
        opacity: 0.90,
      },

      bottom: {
        font: '"AIzaozichunfeng", "字体家AI造字春风", sans-serif',
        size: 28,
        weight: 400,
        color: [242, 188, 127],
        opacity: 0.92,
      },
    },

    evidence: {
      font: '"IBM Plex Sans Condensed", sans-serif',
      size: 14,
      weight: 200,
      xRatio: 0.13,
      yRatio: 0.878,
      widthRatio: 0.74,
      lineHeight: 1.34,
      tracking: 0.42,
      wordSpacing: 0,
      color: [243, 178, 113],
      opacity: 1.00,
    },
  },

  titleFrame: {
    leftRatio: 0.08,
    rightRatio: 0.92,
    topRatio: 0.540,
    bottomRatio: 0.632,
    cornerCut: 25,
    color: [129, 52, 42],
    alpha: 0.98,
    weight: 0.72,
    topWeight: 1.72,
    topGapPadding: 60,
    minimumGapHalfWidthRatio: 0.17,
    fold: {
      fillColor: [74, 21, 14],
      fillAlpha: 0.16,
      lineColor: [157, 55, 38],
      lineAlpha: 0.72,
      weight: 0.72,
    },
    accent: {
      color: [228, 75, 21],
      alpha: 0.94,
      weight: 0.92,
      nodeRadius: 2.00,
      glowAlpha: 0.72,
      glowBlur: 8,
      topNodes: {
        left: { xOffset: -5, yOffset: 0 },
        right: { xOffset: 5, yOffset: 0 },
      },
      cornerMarkLength: 15,
      centerMarkLength: 5,
    },
  },

  animation: {
    startDelaySeconds: 3.00,
    dealSeconds: 0.90,
    chartRevealDelay: 0.24,
    chartRevealSeconds: 0.90,
    textRevealDelay: 0.62,
    textRevealSeconds: 1.25,
  },

  performance: {
    cacheHeavyLayers: true,
    maximumCachePixelRatio: 2.0,
  },

  selection: {
    automatic: true,
  },
};

// #endregion [CARD P01]

// #region [CARD P02] Evidence Cards, Trigger Rules and Runtime State

const PRIVILEGE_CARD_DEFINITIONS = [
  {
    id: "salary-advantage",
    cardNumber: 1,
    condition: { race: "white", gender: "man" },
    chance: 1,
    eyebrow: "THE VALUED CANDIDATE",
    title: "SALARY ADVANTAGE",
    verdict: "YOU WILL RECEIVE A HIGHER SALARY VALUATION.",
    receiptFields: ["race", "gender"],
    evidence:
      "CANDIDATES WITH IDENTICAL QUALIFICATIONS RECEIVED SALARY RECOMMENDATIONS THAT DIFFERED BY UP TO 5% BASED ONLY ON DEMOGRAPHIC SIGNALS. WHITE MALE-ASSOCIATED NAMES RECEIVED ABOVE-AVERAGE OFFERS IN NEARLY EVERY OCCUPATION WITH A SIGNIFICANT GAP.",
    source:
      "750,000+ LLM PROMPTS · GPT-3.5 & LLAMA 3 · EMNLP 2024",
  },
  {
    id: "priority-interview-white-man",
    cardNumber: 2,
    condition: { race: "white", gender: "man" },
    chance: 1,
    eyebrow: "THE SELECTED CANDIDATE",
    title: "PRIORITY INTERVIEW",
    verdict: "YOU WILL BE RANKED AHEAD OF OTHER CANDIDATES.",
    receiptFields: ["race", "gender"],
    evidence:
      "WHITE-ASSOCIATED NAMES WERE SIGNIFICANTLY FAVOURED IN 85.1% OF TESTED CASES. BLACK MALE-ASSOCIATED NAMES WERE DISADVANTAGED IN UP TO 100% OF MODEL–OCCUPATION COMPARISONS.",
    source:
      "3M+ RÉSUMÉ–JOB COMPARISONS · 3 RETRIEVAL MODELS · AIES 2024",
  },
  {
    id: "priority-interview-white-woman",
    cardNumber: 2,
    condition: { race: "white", gender: "woman" },
    chance: 0.481,
    eyebrow: "THE SELECTED CANDIDATE",
    title: "PRIORITY INTERVIEW",
    verdict: "YOU WILL BE RANKED AHEAD OF OTHER CANDIDATES.",
    receiptFields: ["race", "gender"],
    evidence:
      "WHITE FEMALE-ASSOCIATED NAMES WERE PREFERRED OVER BLACK FEMALE-ASSOCIATED NAMES IN 48.1% OF TESTS. A SEPARATE AUDIT FOUND WHITE FEMALE-SOUNDING NAMES TO BE THE MOST FREQUENTLY SELECTED GROUP ACROSS 40 OCCUPATIONS.",
    source:
      "3M+ RÉSUMÉ–JOB COMPARISONS · AIES 2024\n750,000+ LLM PROMPTS · GPT-3.5 & LLAMA 3 · EMNLP 2024",
  },
  {
    id: "high-pay-access",
    cardNumber: 3,
    condition: { gender: "man" },
    chance: 1,
    eyebrow: "THE VISIBLE OPPORTUNITY",
    title: "HIGH-PAY ACCESS",
    verdict: "YOU WILL SEE MORE HIGH-PAYING OPPORTUNITIES.",
    receiptFields: ["gender"],
    evidence:
      "MALE PROFILES RECEIVED $200K+ EXECUTIVE JOB ADS 1,852 TIMES, COMPARED WITH 318 IMPRESSIONS FOR FEMALE PROFILES. THE AUDIT COULD NOT DETERMINE WHETHER THE DIFFERENCE CAME FROM ADVERTISER SETTINGS OR THE PLATFORM’S DELIVERY SYSTEM.",
    source:
      "1,000 SIMULATED USERS · GOOGLE AD ECOSYSTEM · ADFISHER · CMU 2015",
  },
  {
    id: "allocated-care",
    cardNumber: 4,
    condition: { race: "white" },
    chance: 1,
    eyebrow: "THE PRIORITY PATIENT",
    title: "ALLOCATED CARE",
    verdict: "YOU WILL RECEIVE PRIORITY FOR ADDITIONAL CARE.",
    receiptFields: ["race"],
    evidence:
      "BLACK PATIENTS WERE SICKER THAN WHITE PATIENTS AT THE SAME RISK SCORE BECAUSE COST WAS USED AS A PROXY FOR MEDICAL NEED. CORRECTING THE BIAS WOULD HAVE INCREASED THEIR SHARE OF ADDITIONAL CARE FROM 17.7% TO 46.5%.",
    source:
      "49,618 PATIENTS · COMMERCIAL HEALTH-RISK SYSTEM · SCIENCE 2019",
  },
  {
    id: "machine-legibility",
    cardNumber: 5,
    condition: { race: "white", gender: "man" },
    chance: 1,
    eyebrow: "THE LEGIBLE SUBJECT",
    title: "MACHINE LEGIBILITY",
    verdict: "YOU WILL BE READ MORE ACCURATELY.",
    receiptFields: ["race", "gender"],
    evidence:
      "LIGHTER-SKINNED MEN HAD ERROR RATES NO HIGHER THAN 0.8%, WHILE DARKER-SKINNED WOMEN REACHED 34.7%. ACCURACY CHANGED AT THE INTERSECTION OF PERCEIVED GENDER AND SKIN TONE.",
    source:
      "3 COMMERCIAL GENDER CLASSIFIERS · GENDER SHADES 2018",
  },
  {
    id: "lower-financial-friction",
    cardNumber: 6,
    condition: { race: "white" },
    chance: 1,
    eyebrow: "THE PREFERRED BORROWER",
    title: "LOWER FINANCIAL FRICTION",
    verdict: "YOU WILL RECEIVE MORE FAVOURABLE LOAN PRICING.",
    receiptFields: ["race"],
    evidence:
      "LATINX AND AFRICAN-AMERICAN BORROWERS PAID APPROXIMATELY 5.3 BASIS POINTS MORE FOR HOME-PURCHASE MORTGAGES. FINTECH REDUCED THE PRICING GAP, BUT DID NOT ELIMINATE IT.",
    source:
      "MORTGAGE ORIGINATIONS 2009–2015 · FINTECH LENDING · NBER 2019",
  },
];

const privilegeCardRuntime = {
  visible: false,
  startedAtSeconds: 0,
  result: null,
  evaluatedPlateRevision: null,
};

let privilegeAstrolabeSnapshotCanvas = null;
let privilegeAstrolabeSnapshotContext = null;
let privilegeAstrolabeSnapshotGeometry = null;
let privilegeCardHeavyLayerCache = null;
let privilegeCardFontsReady = typeof document === "undefined" || !document.fonts;

// The static card frame and typography are cached because they are expensive to
// redraw at exhibition resolution. A new subject or font load invalidates the cache.
function privilegeInvalidateHeavyLayerCache() {
  privilegeCardHeavyLayerCache = null;
}

if (!privilegeCardFontsReady) {
  Promise.all([
    document.fonts.load('400 28px "Big Shoulders Display"', "PRIVILEGE ARCANA"),
    document.fonts.load('300 63px "Big Shoulders Display"', "MACHINE LEGIBILITY"),
    document.fonts.load('400 27px "AIzaozichunfeng"', "THE SELECTED CANDIDATE"),
    document.fonts.load('200 14px "IBM Plex Sans Condensed"', "RESEARCH EVIDENCE"),
  ]).then(() => {
    privilegeCardFontsReady = true;
    privilegeInvalidateHeavyLayerCache();
  }).catch(() => {
    privilegeCardFontsReady = true;
    privilegeInvalidateHeavyLayerCache();
  });
}

function privilegeClamp(value, minimum = 0, maximum = 1) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

function privilegeMix(a, b, amount) {
  return a + (b - a) * amount;
}

function privilegeSmooth(value) {
  const amount = privilegeClamp(value);
  return amount * amount * (3 - 2 * amount);
}

function privilegeDominantClassification(entries = {}, type = "race") {
  // Accept either 0..1 or 0..100 distributions and retain the model's top label.
  const rawEntries = Object.entries(entries || {}).map(([rawKey, rawValue]) => ({
    rawKey,
    value: Math.max(0, Number(rawValue) || 0),
  }));
  const rawTotal = rawEntries.reduce((sum, entry) => sum + entry.value, 0);
  const usesZeroToOneScale = rawEntries.length > 0
    && rawEntries.every((entry) => entry.value <= 1)
    && rawTotal <= 1.5;
  const normalized = rawEntries.map(({ rawKey, value }) => {
    const key = String(rawKey).trim().toLowerCase();
    return {
      key: type === "gender" && key === "female" ? "woman"
        : type === "gender" && key === "male" ? "man"
          : key,
      probability: privilegeClamp(
        usesZeroToOneScale ? value * 100 : value,
        0,
        100,
      ),
    };
  });
  if (!normalized.length) return { key: "unknown", probability: 0 };
  return normalized.reduce((best, entry) => (
    entry.probability > best.probability ? entry : best
  ));
}

function privilegeClassifySignal(signal = {}) {
  return {
    race: privilegeDominantClassification(signal.race, "race"),
    gender: privilegeDominantClassification(signal.gender, "gender"),
  };
}

function privilegeConditionSpecificity(definition) {
  return Object.values(definition.condition || {}).filter(Boolean).length;
}

function privilegeConditionMatches(definition, classification) {
  return Object.entries(definition.condition || {}).every(
    ([field, expected]) => classification[field]?.key === expected,
  );
}

function privilegeChooseDefinition(signal = {}) {
  // Match the most specific condition first. If several cards have equal
  // specificity, apply their documented chance and choose one of the survivors.
  const classification = privilegeClassifySignal(signal);
  const eligible = PRIVILEGE_CARD_DEFINITIONS.filter(
    (definition) => privilegeConditionMatches(definition, classification),
  );
  if (!eligible.length) return { definition: null, classification };

  const specificities = [...new Set(
    eligible.map(privilegeConditionSpecificity),
  )].sort((a, b) => b - a);

  for (const specificity of specificities) {
    const samePriority = eligible.filter(
      (definition) => privilegeConditionSpecificity(definition) === specificity,
    );
    const passedChance = samePriority.filter(
      (definition) => Math.random() < privilegeClamp(definition.chance ?? 1),
    );
    if (!passedChance.length) continue;

    const selected = passedChance[
      Math.floor(Math.random() * passedChance.length)
    ];
    return { definition: selected, classification };
  }

  return { definition: null, classification };
}

function privilegeReceiptValue(definition, classification) {
  return (definition.receiptFields || []).map((field) => {
    const entry = classification[field] || { key: "unknown", probability: 0 };
    return `${entry.key.toUpperCase()} ${Math.round(entry.probability)}%`;
  }).join("  ·  ");
}

function privilegeAssembleResult(definition, signal = {}) {
  if (!definition) return null;
  const classification = privilegeClassifySignal(signal);
  return {
    subjectId: String(signal.subjectId || "UNREGISTERED SUBJECT"),
    cardId: definition.id,
    cardNumber: definition.cardNumber,
    eyebrow: definition.eyebrow,
    title: definition.title,
    verdict: definition.verdict,
    receiptLabel: "CLASSIFIED BY SYSTEM",
    receiptValue: privilegeReceiptValue(definition, classification),
    evidence: definition.evidence,
    source: definition.source,
  };
}

function privilegeBuildResult(signal = {}) {
  const { definition } = privilegeChooseDefinition(signal);
  return privilegeAssembleResult(definition, signal);
}

function privilegeCreateDebugSignal(definition) {
  // Preview-only data used by the P key; it never enters the camera pipeline.
  const raceKeys = [
    "white",
    "black",
    "asian",
    "indian",
    "middle_eastern",
    "latino_hispanic",
  ];
  const dominantRace = definition.condition?.race
    || raceKeys[Math.floor(Math.random() * raceKeys.length)];
  const dominantGender = definition.condition?.gender
    || (Math.random() < 0.5 ? "man" : "woman");
  const raceProbability = Math.round(72 + Math.random() * 25);
  const genderProbability = Math.round(72 + Math.random() * 25);
  const remainingRace = (100 - raceProbability) / (raceKeys.length - 1);

  return {
    subjectId: `CARD-PREVIEW-${String(definition.cardNumber).padStart(2, "0")}`,
    race: Object.fromEntries(raceKeys.map((key) => [
      key,
      key === dominantRace ? raceProbability : remainingRace,
    ])),
    gender: {
      Man: dominantGender === "man" ? genderProbability : 100 - genderProbability,
      Woman: dominantGender === "woman" ? genderProbability : 100 - genderProbability,
    },
  };
}

window.showPrivilegeCard = function showPrivilegeCard(payload = {}) {
  const signal = payload.signal ?? payload;
  const result = privilegeBuildResult(signal);
  privilegeCardRuntime.visible = Boolean(result);
  privilegeCardRuntime.result = result;
  privilegeInvalidateHeavyLayerCache();
  if (result) privilegeCardRuntime.startedAtSeconds = millis() * 0.001;
  return result;
};

window.showRandomPrivilegeCard = function showRandomPrivilegeCard(payload = {}) {
  const definition = PRIVILEGE_CARD_DEFINITIONS[
    Math.floor(Math.random() * PRIVILEGE_CARD_DEFINITIONS.length)
  ];
  const signal = privilegeCreateDebugSignal(definition);
  const result = privilegeAssembleResult(definition, signal);
  privilegeCardRuntime.visible = true;
  privilegeCardRuntime.result = result;
  privilegeInvalidateHeavyLayerCache();
  privilegeCardRuntime.startedAtSeconds = millis() * 0.001;
  if (Number.isFinite(payload.plateRevision)) {
    privilegeCardRuntime.evaluatedPlateRevision = payload.plateRevision;
  }
  return result;
};

window.hidePrivilegeCard = function hidePrivilegeCard() {
  privilegeCardRuntime.visible = false;
  privilegeCardRuntime.result = null;
  privilegeInvalidateHeavyLayerCache();
};

window.togglePrivilegeCard = function togglePrivilegeCard(payload = {}) {
  if (privilegeCardRuntime.visible) {
    window.hidePrivilegeCard();
  } else {
    window.showPrivilegeCard(payload);
  }
};

window.isPrivilegeCardVisible = function isPrivilegeCardVisible() {
  return privilegeCardRuntime.visible;
};

window.getPrivilegeCardResult = function getPrivilegeCardResult(payload = {}) {
  return privilegeBuildResult(payload.signal ?? payload);
};

// #endregion [CARD P02]

// #region [CARD F01] Text and Canvas Utilities

function privilegeRgba(rgb, opacity) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${privilegeClamp(opacity)})`;
}

function privilegeTraceCutCard(context, x, y, cardWidth, cardHeight, cornerCut) {
  context.beginPath();
  context.moveTo(x + cornerCut, y);
  context.lineTo(x + cardWidth - cornerCut, y);
  context.lineTo(x + cardWidth, y + cornerCut);
  context.lineTo(x + cardWidth, y + cardHeight - cornerCut);
  context.lineTo(x + cardWidth - cornerCut, y + cardHeight);
  context.lineTo(x + cornerCut, y + cardHeight);
  context.lineTo(x, y + cardHeight - cornerCut);
  context.lineTo(x, y + cornerCut);
  context.closePath();
}

function privilegeTraceConcaveCornerRect(
  context,
  x,
  y,
  width,
  height,
  cornerCut,
  concavity = 1,
) {
  const maximumCut = Math.min(width, height) * 0.45;
  const cut = privilegeClamp(cornerCut, 0, maximumCut);
  const depth = cut * privilegeClamp(concavity, 0.2, 1.8);
  const right = x + width;
  const bottom = y + height;

  context.beginPath();
  context.moveTo(x + cut, y);
  context.lineTo(right - cut, y);
  context.quadraticCurveTo(right - depth, y + depth, right, y + cut);
  context.lineTo(right, bottom - cut);
  context.quadraticCurveTo(
    right - depth,
    bottom - depth,
    right - cut,
    bottom,
  );
  context.lineTo(x + cut, bottom);
  context.quadraticCurveTo(x + depth, bottom - depth, x, bottom - cut);
  context.lineTo(x, y + cut);
  context.quadraticCurveTo(x + depth, y + depth, x + cut, y);
  context.closePath();
}

function privilegeGetBorderInset(borderStyle, borderIndex, scale = 1) {
  let inset = Math.max(0, Number(borderStyle.outerInset) || 0);
  for (let gapIndex = 0; gapIndex < borderIndex; gapIndex += 1) {
    inset += Math.max(0, Number(borderStyle.gaps?.[gapIndex]) || 0);
  }
  return inset * scale;
}

function privilegeGetInnerContentCard(card, scale) {
  const borderStyle = PRIVILEGE_CARD_STYLE.border;
  const innermostIndex = Math.max(0, borderStyle.count - 1);
  const inset = privilegeGetBorderInset(borderStyle, innermostIndex, scale);
  return {
    x: card.x + inset,
    y: card.y + inset,
    width: Math.max(1, card.width - inset * 2),
    height: Math.max(1, card.height - inset * 2),
    cornerCut: Math.max(3, card.cornerCut - inset * 0.18),
  };
}

function privilegeMeasureTrackedText(
  context,
  content,
  tracking = 0,
  wordSpacing = 0,
) {
  const characters = Array.from(String(content));
  const widths = characters.map((character) => context.measureText(character).width);
  const spaceCount = characters.reduce(
    (count, character) => count + (character === " " ? 1 : 0),
    0,
  );
  return {
    characters,
    widths,
    totalWidth: widths.reduce((sum, value) => sum + value, 0)
      + Math.max(0, characters.length - 1) * tracking
      + spaceCount * wordSpacing,
  };
}

function privilegeDrawTrackedText(
  context,
  content,
  x,
  y,
  tracking,
  align = "left",
  wordSpacing = 0,
) {
  const { characters, widths, totalWidth } = privilegeMeasureTrackedText(
    context,
    content,
    tracking,
    wordSpacing,
  );
  let cursor = align === "center" ? x - totalWidth * 0.5 : x;
  const previousTextAlign = context.textAlign;
  context.textAlign = "left";
  characters.forEach((character, index) => {
    context.fillText(character, cursor, y);
    cursor += widths[index];
    if (character === " ") cursor += wordSpacing;
    if (index < characters.length - 1) cursor += tracking;
  });
  context.textAlign = previousTextAlign;
}

function privilegeWrapTrackedText(
  context,
  content,
  maximumWidth,
  tracking = 0,
  wordSpacing = 0,
) {
  const lines = [];
  String(content).split("\n").forEach((paragraph) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      return;
    }

    let currentLine = words[0];
    words.slice(1).forEach((word) => {
      const candidate = `${currentLine} ${word}`;
      const candidateWidth = privilegeMeasureTrackedText(
        context,
        candidate,
        tracking,
        wordSpacing,
      ).totalWidth;
      if (candidateWidth <= maximumWidth) {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    lines.push(currentLine);
  });
  return lines;
}

function privilegeDrawTrackedParagraph(
  context,
  content,
  x,
  firstBaselineY,
  maximumWidth,
  lineHeight,
  tracking,
  align = "left",
  wordSpacing = 0,
) {
  const lines = privilegeWrapTrackedText(
    context,
    content,
    maximumWidth,
    tracking,
    wordSpacing,
  );
  lines.forEach((line, index) => {
    privilegeDrawTrackedText(
      context,
      line,
      x,
      firstBaselineY + index * lineHeight,
      tracking,
      align,
      wordSpacing,
    );
  });
  return lines.length;
}

// #endregion [CARD F01]

// #region [CARD F02] Astrolabe Capture and Card Rendering

window.capturePrivilegeAstrolabeSource = function capturePrivilegeAstrolabeSource({
  astrolabeData,
  plateRevision = 0,
  scale = 1,
  ready = true,
}) {
  // Store one clean, high-resolution plate image per subject. Transient scan,
  // glitch, readout, and card layers are deliberately excluded by draw order.
  if (!astrolabeData || !ready) return;
  if (privilegeAstrolabeSnapshotGeometry?.plateRevision === plateRevision) return;
  const sourceCanvas = drawingContext.canvas;
  const chartStyle = PRIVILEGE_CARD_STYLE.chartFragment;
  const sourceScaleX = sourceCanvas.width / Math.max(1, width);
  const sourceScaleY = sourceCanvas.height / Math.max(1, height);
  const outerPoints = Array.isArray(astrolabeData.outer)
    ? astrolabeData.outer
    : [];
  const measuredOuterDistance = outerPoints.reduce(
    (maximum, point) => Math.max(
      maximum,
      Math.hypot(point.x - astrolabeData.cx, point.y - astrolabeData.cy),
    ),
    0,
  );
  const farthestOuterDistance = measuredOuterDistance || astrolabeData.radius;
  const sourcePadding = Math.max(
    astrolabeData.radius * chartStyle.sourcePaddingRatio,
    chartStyle.sourceMinimumPadding * scale,
  );
  const sourceRadius = farthestOuterDistance + sourcePadding;
  const cropX = (astrolabeData.cx - sourceRadius) * sourceScaleX;
  const cropY = (astrolabeData.cy - sourceRadius) * sourceScaleY;
  const cropWidth = sourceRadius * 2 * sourceScaleX;
  const cropHeight = sourceRadius * 2 * sourceScaleY;
  const resolutionScale = Math.max(
    1,
    Number(chartStyle.snapshotResolutionScale) || 1,
  );
  const snapshotWidth = Math.max(1, Math.round(cropWidth * resolutionScale));
  const snapshotHeight = Math.max(1, Math.round(cropHeight * resolutionScale));

  if (!privilegeAstrolabeSnapshotCanvas) {
    privilegeAstrolabeSnapshotCanvas = document.createElement("canvas");
    privilegeAstrolabeSnapshotContext = privilegeAstrolabeSnapshotCanvas.getContext("2d");
  }
  if (
    privilegeAstrolabeSnapshotCanvas.width !== snapshotWidth
    || privilegeAstrolabeSnapshotCanvas.height !== snapshotHeight
  ) {
    privilegeAstrolabeSnapshotCanvas.width = snapshotWidth;
    privilegeAstrolabeSnapshotCanvas.height = snapshotHeight;
  }
  privilegeAstrolabeSnapshotContext.setTransform(1, 0, 0, 1, 0, 0);
  privilegeAstrolabeSnapshotContext.globalCompositeOperation = "copy";
  privilegeAstrolabeSnapshotContext.imageSmoothingEnabled = true;
  privilegeAstrolabeSnapshotContext.imageSmoothingQuality = "high";
  privilegeAstrolabeSnapshotContext.drawImage(
    sourceCanvas,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    snapshotWidth,
    snapshotHeight,
  );
  privilegeAstrolabeSnapshotGeometry = {
    plateRevision,
  };
};

function privilegeDrawCardChartFragment(
  context,
  card,
  scale,
  opacity,
  plateRevision,
) {
  if (
    !privilegeAstrolabeSnapshotCanvas
    || !privilegeAstrolabeSnapshotGeometry
    || privilegeAstrolabeSnapshotGeometry.plateRevision !== plateRevision
  ) return;
  const style = PRIVILEGE_CARD_STYLE.chartFragment;
  const destinationCenterX = card.x + card.width * style.centerXRatio;
  const destinationCenterY = card.y + card.height * style.centerYRatio;
  const destinationRadius = card.width * style.radiusToCardWidth;

  context.save();
  privilegeTraceCutCard(
    context,
    card.x,
    card.y,
    card.width,
    card.height,
    card.cornerCut,
  );
  context.clip();
  context.globalAlpha *= opacity;

  context.globalCompositeOperation = "screen";

  context.translate(destinationCenterX, destinationCenterY);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    privilegeAstrolabeSnapshotCanvas,
    0,
    0,
    privilegeAstrolabeSnapshotCanvas.width,
    privilegeAstrolabeSnapshotCanvas.height,
    -destinationRadius,
    -destinationRadius,
    destinationRadius * 2,
    destinationRadius * 2,
  );
  context.restore();
}

function privilegeDrawBorders(context, card, scale, opacity) {
  const style = PRIVILEGE_CARD_STYLE.border;
  context.save();
  context.globalAlpha *= opacity;
  for (let index = 0; index < style.count; index += 1) {
    const inset = privilegeGetBorderInset(style, index, scale);
    privilegeTraceCutCard(
      context,
      card.x + inset,
      card.y + inset,
      card.width - inset * 2,
      card.height - inset * 2,
      Math.max(3, card.cornerCut - inset * 0.18),
    );
    context.strokeStyle = privilegeRgba(style.colors[index], style.alphas[index]);
    context.lineWidth = style.weights[index] * scale;
    context.stroke();
  }
  context.restore();
}

function privilegeDrawTitleFrame(context, card, scale, opacity, eyebrowText) {
  const frameStyle = PRIVILEGE_CARD_STYLE.titleFrame;
  const typeStyle = PRIVILEGE_CARD_STYLE.typography;
  const eyebrowStyle = typeStyle.eyebrow;
  const left = card.x + card.width * frameStyle.leftRatio;
  const right = card.x + card.width * frameStyle.rightRatio;
  const top = card.y + card.height * frameStyle.topRatio;
  const bottom = card.y + card.height * frameStyle.bottomRatio;
  const centerX = card.x + card.width * 0.5;
  const gapCenterX = card.x + card.width * eyebrowStyle.xRatio;
  const cut = frameStyle.cornerCut * scale;

  context.save();
  context.globalAlpha *= opacity;
  context.font = `${eyebrowStyle.weight} ${eyebrowStyle.size * scale}px ${eyebrowStyle.font}`;
  const measuredHalfWidth = privilegeMeasureTrackedText(
    context,
    eyebrowText,
    eyebrowStyle.tracking * scale,
    eyebrowStyle.wordSpacing * scale,
  ).totalWidth * 0.5;
  const gapHalfWidth = Math.min(
    (right - left) * 0.39,
    Math.max(
      card.width * frameStyle.minimumGapHalfWidthRatio,
      measuredHalfWidth + frameStyle.topGapPadding * scale,
    ),
  );
  const gapLeft = gapCenterX - gapHalfWidth;
  const gapRight = gapCenterX + gapHalfWidth;

  context.setLineDash([]);
  context.strokeStyle = privilegeRgba(frameStyle.color, frameStyle.alpha);

  context.lineWidth = frameStyle.topWeight * scale;
  context.beginPath();
  context.moveTo(left + cut, top);
  context.lineTo(gapLeft, top);
  context.moveTo(gapRight, top);
  context.lineTo(right - cut, top);
  context.stroke();

  context.lineWidth = frameStyle.weight * scale;
  context.beginPath();
  context.moveTo(right - cut, top);
  context.lineTo(right, top + cut);
  context.lineTo(right, bottom);
  context.lineTo(left, bottom);
  context.lineTo(left, top + cut);
  context.lineTo(left + cut, top);
  context.stroke();

  const fold = frameStyle.fold;
  const drawFoldTriangle = (points) => {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[1].x, points[1].y);
    context.lineTo(points[2].x, points[2].y);
    context.closePath();
    context.fillStyle = privilegeRgba(fold.fillColor, fold.fillAlpha);
    context.fill();
    context.strokeStyle = privilegeRgba(fold.lineColor, fold.lineAlpha);
    context.lineWidth = fold.weight * scale;
    context.stroke();
  };
  drawFoldTriangle([
    { x: left, y: top + cut },
    { x: left + cut, y: top },
    { x: left + cut, y: top + cut },
  ]);
  drawFoldTriangle([
    { x: right, y: top + cut },
    { x: right - cut, y: top },
    { x: right - cut, y: top + cut },
  ]);

  const accent = frameStyle.accent;
  context.strokeStyle = privilegeRgba(accent.color, accent.alpha);
  context.fillStyle = privilegeRgba(accent.color, accent.alpha);
  context.lineWidth = accent.weight * scale;
  context.shadowColor = privilegeRgba(accent.color, accent.glowAlpha);
  context.shadowBlur = accent.glowBlur * scale;

  const topNodes = accent.topNodes || {};
  const topNodePositions = [
    {
      x: gapLeft + (topNodes.left?.xOffset || 0) * scale,
      y: top + (topNodes.left?.yOffset || 0) * scale,
    },
    {
      x: gapRight + (topNodes.right?.xOffset || 0) * scale,
      y: top + (topNodes.right?.yOffset || 0) * scale,
    },
  ];
  topNodePositions.forEach((point) => {
    context.beginPath();
    context.arc(point.x, point.y, accent.nodeRadius * scale, 0, Math.PI * 2);
    context.fill();
  });

  const mark = accent.cornerMarkLength * scale;
  context.beginPath();
  context.moveTo(left + cut, top - mark * 0.55);
  context.lineTo(left + cut, top + mark * 0.55);
  context.moveTo(right - cut, top - mark * 0.55);
  context.lineTo(right - cut, top + mark * 0.55);
  context.stroke();

  const centerMark = accent.centerMarkLength * scale;
  context.beginPath();
  context.moveTo(centerX, bottom - centerMark);
  context.lineTo(centerX, bottom + centerMark);
  context.moveTo(centerX - centerMark * 0.34, bottom);
  context.lineTo(centerX + centerMark * 0.34, bottom);
  context.stroke();
  context.restore();
}

function privilegeDrawCardTypography(context, card, result, scale, opacity) {
  const style = PRIVILEGE_CARD_STYLE.typography;
  const headerStyle = style.header;
  const eyebrowStyle = style.eyebrow;
  const titleStyle = style.title;
  const verdictStyle = style.verdict;
  const receiptStyle = style.receipt;
  const evidenceStyle = style.evidence;
  const left = card.x + card.width * headerStyle.xRatio;
  const centerX = card.x + card.width * 0.5;
  const eyebrowX = card.x + card.width * eyebrowStyle.xRatio;
  const titleX = card.x + card.width * titleStyle.xRatio;
  context.save();
  context.globalAlpha *= opacity;
  context.textBaseline = "alphabetic";
  context.textAlign = "left";
  context.fillStyle = privilegeRgba(headerStyle.color, headerStyle.opacity);

  context.font = `${headerStyle.weight} ${headerStyle.size * scale}px ${headerStyle.font}`;
  privilegeDrawTrackedText(
    context,
    `PRIVILEGE ARCANA  ${String(result.cardNumber).padStart(2, "0")}`,
    left,
    card.y + card.height * headerStyle.yRatio,
    headerStyle.tracking * scale,
    "left",
    headerStyle.wordSpacing * scale,
  );

  privilegeDrawTitleFrame(context, card, scale, 1, result.eyebrow);

  context.textAlign = "center";
  context.font = `${eyebrowStyle.weight} ${eyebrowStyle.size * scale}px ${eyebrowStyle.font}`;
  context.fillStyle = privilegeRgba(eyebrowStyle.color, eyebrowStyle.opacity);
  const eyebrowMetrics = context.measureText(String(result.eyebrow));
  const eyebrowAscent = Number(eyebrowMetrics.actualBoundingBoxAscent)
    || eyebrowStyle.size * scale * 0.76;
  const eyebrowDescent = Number(eyebrowMetrics.actualBoundingBoxDescent)
    || eyebrowStyle.size * scale * 0.24;
  const eyebrowBaselineY = eyebrowStyle.alignToFrameTop
    ? card.y
      + card.height * PRIVILEGE_CARD_STYLE.titleFrame.topRatio
      + (eyebrowAscent - eyebrowDescent) * 0.5
      + eyebrowStyle.frameCenterOffset * scale
    : card.y + card.height * eyebrowStyle.yRatio;
  context.shadowColor = privilegeRgba(
    eyebrowStyle.glow.color,
    eyebrowStyle.glow.alpha,
  );
  context.shadowBlur = eyebrowStyle.glow.blur * scale;
  privilegeDrawTrackedText(
    context,
    result.eyebrow,
    eyebrowX,
    eyebrowBaselineY,
    eyebrowStyle.tracking * scale,
    "center",
    eyebrowStyle.wordSpacing * scale,
  );
  context.shadowBlur = 0;
  context.shadowColor = "rgba(0,0,0,0)";

  context.font = `${titleStyle.weight} ${titleStyle.size * scale}px ${titleStyle.font}`;
  context.fillStyle = privilegeRgba(titleStyle.color, titleStyle.opacity);
  context.shadowColor = privilegeRgba(
    titleStyle.glow.color,
    titleStyle.glow.alpha,
  );
  context.shadowBlur = titleStyle.glow.blur * scale;
  privilegeDrawTrackedText(
    context,
    result.title,
    titleX,
    card.y + card.height * titleStyle.yRatio,
    titleStyle.tracking * scale,
    "center",
    titleStyle.wordSpacing * scale,
  );
  context.shadowBlur = 0;
  context.shadowColor = "rgba(0,0,0,0)";

  context.font = `${verdictStyle.weight} ${verdictStyle.size * scale}px ${verdictStyle.font}`;
  context.fillStyle = privilegeRgba(
    verdictStyle.color,
    verdictStyle.opacity,
  );
  privilegeDrawTrackedParagraph(
    context,
    result.verdict,
    card.x + card.width * verdictStyle.xRatio,
    card.y + card.height * verdictStyle.yRatio,
    card.width * verdictStyle.widthRatio,
    verdictStyle.size * verdictStyle.lineHeight * scale,
    verdictStyle.tracking * scale,
    "center",
    verdictStyle.wordSpacing * scale,
  );

  const receiptX = card.x + card.width * receiptStyle.xRatio;
  const receiptY = card.y + card.height * receiptStyle.yRatio;
  const receiptWidth = card.width * receiptStyle.widthRatio;
  const receiptHeight = card.height * receiptStyle.heightRatio;
  context.strokeStyle = privilegeRgba(
    receiptStyle.frameColor,
    receiptStyle.frameOpacity,
  );
  context.lineWidth = receiptStyle.frameWeight * scale;
  privilegeTraceConcaveCornerRect(
    context,
    receiptX,
    receiptY,
    receiptWidth,
    receiptHeight,
    receiptStyle.cornerCut * scale,
    receiptStyle.cornerConcavity,
  );
  context.stroke();
  context.beginPath();
  context.moveTo(
    receiptX,
    receiptY + receiptHeight * receiptStyle.dividerRatio,
  );
  context.lineTo(
    receiptX + receiptWidth,
    receiptY + receiptHeight * receiptStyle.dividerRatio,
  );
  context.stroke();

  const receiptTopStyle = receiptStyle.top;
  const receiptBottomStyle = receiptStyle.bottom;
  const receiptDividerY = receiptY + receiptHeight * receiptStyle.dividerRatio;
  const receiptTopCenterY = receiptY
    + receiptHeight * receiptStyle.dividerRatio * 0.5;
  const receiptBottomCenterY = receiptDividerY
    + receiptHeight * (1 - receiptStyle.dividerRatio) * 0.5;
  const previousTextBaseline = context.textBaseline;
  context.textBaseline = "middle";

  context.font = `${receiptTopStyle.weight} ${receiptTopStyle.size * scale}px ${receiptTopStyle.font}`;
  context.fillStyle = privilegeRgba(
    receiptTopStyle.color,
    receiptTopStyle.opacity,
  );
  context.fillText(
    result.receiptLabel,
    centerX,
    receiptTopCenterY,
  );

  context.font = `${receiptBottomStyle.weight} ${receiptBottomStyle.size * scale}px ${receiptBottomStyle.font}`;
  context.fillStyle = privilegeRgba(
    receiptBottomStyle.color,
    receiptBottomStyle.opacity,
  );
  context.fillText(
    result.receiptValue,
    centerX,
    receiptBottomCenterY,
  );
  context.textBaseline = previousTextBaseline;

  const evidenceText = String(result.evidence || "")
    .trim()
    .replace(/^\*\s*/, "");
  const sourceText = String(result.source || "").trim();
  context.font = `${evidenceStyle.weight} ${evidenceStyle.size * scale}px ${evidenceStyle.font}`;
  context.fillStyle = privilegeRgba(
    evidenceStyle.color,
    evidenceStyle.opacity,
  );
  const evidenceX = card.x + card.width * evidenceStyle.xRatio;
  const evidenceY = card.y + card.height * evidenceStyle.yRatio;
  const evidenceWidth = card.width * evidenceStyle.widthRatio;
  const evidenceLineHeight = evidenceStyle.size
    * evidenceStyle.lineHeight
    * scale;
  const evidenceTracking = evidenceStyle.tracking * scale;
  const evidenceWordSpacing = evidenceStyle.wordSpacing * scale;
  const evidenceMarker = "* ";
  const evidenceMarkerWidth = privilegeMeasureTrackedText(
    context,
    evidenceMarker,
    evidenceTracking,
    evidenceWordSpacing,
  ).totalWidth;
  const evidenceLines = privilegeWrapTrackedText(
    context,
    evidenceText,
    Math.max(1, evidenceWidth - evidenceMarkerWidth),
    evidenceTracking,
    evidenceWordSpacing,
  );

  privilegeDrawTrackedText(
    context,
    evidenceMarker,
    evidenceX,
    evidenceY,
    evidenceTracking,
    "left",
    evidenceWordSpacing,
  );
  evidenceLines.forEach((line, index) => {
    privilegeDrawTrackedText(
      context,
      line,
      evidenceX + evidenceMarkerWidth,
      evidenceY + index * evidenceLineHeight,
      evidenceTracking,
      "left",
      evidenceWordSpacing,
    );
  });

  if (sourceText) {
    privilegeDrawTrackedParagraph(
      context,
      sourceText,
      evidenceX + evidenceMarkerWidth,
      evidenceY + (Math.max(1, evidenceLines.length) + 1) * evidenceLineHeight,
      Math.max(1, evidenceWidth - evidenceMarkerWidth),
      evidenceLineHeight,
      evidenceTracking,
      "left",
      evidenceWordSpacing,
    );
  }
  context.restore();
}

function privilegeBuildHeavyLayerCache(card, scale, result, plateRevision) {
  // Build chart and typography layers once, then composite them every frame.
  const performanceStyle = PRIVILEGE_CARD_STYLE.performance || {};
  if (!performanceStyle.cacheHeavyLayers || !privilegeCardFontsReady) return null;

  const sourceCanvas = drawingContext.canvas;
  const sourceRatioX = sourceCanvas.width / Math.max(1, width);
  const sourceRatioY = sourceCanvas.height / Math.max(1, height);
  const cachePixelRatio = Math.max(
    0.5,
    Math.min(
      Number(performanceStyle.maximumCachePixelRatio) || 1,
      sourceRatioX,
      sourceRatioY,
    ),
  );
  const cacheWidth = Math.max(1, Math.ceil(card.width * cachePixelRatio));
  const cacheHeight = Math.max(1, Math.ceil(card.height * cachePixelRatio));
  const cacheKey = [
    plateRevision,
    result.subjectId,
    result.cardId,
    result.receiptValue,
    cacheWidth,
    cacheHeight,
    scale.toFixed(5),
  ].join("|");

  if (privilegeCardHeavyLayerCache?.key === cacheKey) {
    return privilegeCardHeavyLayerCache;
  }

  const createLayer = () => {
    const canvas = document.createElement("canvas");
    canvas.width = cacheWidth;
    canvas.height = cacheHeight;
    const context = canvas.getContext("2d", { alpha: true });
    context.clearRect(0, 0, cacheWidth, cacheHeight);
    context.setTransform(
      cachePixelRatio,
      0,
      0,
      cachePixelRatio,
      -card.x * cachePixelRatio,
      -card.y * cachePixelRatio,
    );
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    return { canvas, context };
  };

  const contentCard = privilegeGetInnerContentCard(card, scale);
  const chartLayer = createLayer();
  chartLayer.context.save();
  privilegeTraceCutCard(
    chartLayer.context,
    contentCard.x,
    contentCard.y,
    contentCard.width,
    contentCard.height,
    contentCard.cornerCut,
  );
  chartLayer.context.clip();
  privilegeDrawCardChartFragment(
    chartLayer.context,
    card,
    scale,
    1,
    plateRevision,
  );
  chartLayer.context.restore();

  const typographyLayer = createLayer();
  typographyLayer.context.save();
  privilegeTraceCutCard(
    typographyLayer.context,
    contentCard.x,
    contentCard.y,
    contentCard.width,
    contentCard.height,
    contentCard.cornerCut,
  );
  typographyLayer.context.clip();
  privilegeDrawCardTypography(
    typographyLayer.context,
    card,
    result,
    scale,
    1,
  );
  typographyLayer.context.restore();

  privilegeCardHeavyLayerCache = {
    key: cacheKey,
    chartCanvas: chartLayer.canvas,
    typographyCanvas: typographyLayer.canvas,
  };
  return privilegeCardHeavyLayerCache;
}

function privilegeDrawCachedCardLayer(
  context,
  canvas,
  card,
  opacity,
  compositeOperation = "source-over",
) {
  if (!canvas || opacity <= 0) return;
  context.save();
  context.globalAlpha *= privilegeClamp(opacity);
  context.globalCompositeOperation = compositeOperation;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    card.x,
    card.y,
    card.width,
    card.height,
  );
  context.restore();
}

window.drawPrivilegeCard = function drawPrivilegeCard({
  frame,
  scale,
  signal = {},
  plateRevision = 0,
}) {
  // Automatic evaluation runs once per completed plate revision.
  const snapshotReady = Boolean(
    privilegeAstrolabeSnapshotGeometry
    && privilegeAstrolabeSnapshotGeometry.plateRevision === plateRevision
  );
  if (
    PRIVILEGE_CARD_STYLE.selection.automatic
    && snapshotReady
    && privilegeCardRuntime.evaluatedPlateRevision !== plateRevision
  ) {
    privilegeCardRuntime.evaluatedPlateRevision = plateRevision;
    window.showPrivilegeCard(signal);
  }

  if (!privilegeCardRuntime.visible || !privilegeCardRuntime.result) return;

  if (!privilegeCardFontsReady) {
    privilegeCardRuntime.startedAtSeconds = millis() * 0.001;
    return;
  }

  const style = PRIVILEGE_CARD_STYLE;
  const result = privilegeCardRuntime.result;
  const context = drawingContext;
  const elapsedSinceTriggerSeconds = Math.max(
    0,
    millis() * 0.001 - privilegeCardRuntime.startedAtSeconds,
  );
  const elapsedSeconds = Math.max(
    0,
    elapsedSinceTriggerSeconds
      - Math.max(0, Number(style.animation.startDelaySeconds) || 0),
  );
  const dealProgress = privilegeSmooth(
    elapsedSeconds / Math.max(0.05, style.animation.dealSeconds),
  );
  const chartProgress = privilegeSmooth(
    (elapsedSeconds - style.animation.chartRevealDelay)
      / Math.max(0.05, style.animation.chartRevealSeconds),
  );
  const textProgress = privilegeSmooth(
    (elapsedSeconds - style.animation.textRevealDelay)
      / Math.max(0.05, style.animation.textRevealSeconds),
  );

  const cardWidth = Math.min(
    frame.width * style.layout.widthRatio,
    frame.height * style.layout.maximumHeightRatio * style.layout.aspectRatio,
  );
  const cardHeight = cardWidth / style.layout.aspectRatio;
  const card = {
    width: cardWidth,
    height: cardHeight,
    x: frame.x + (frame.width - cardWidth) * 0.5,
    y: frame.y + frame.height * style.layout.centerYRatio - cardHeight * 0.5,
    cornerCut: style.layout.cornerCut * scale,
  };
  const heavyLayerCache = privilegeBuildHeavyLayerCache(
    card,
    scale,
    result,
    plateRevision,
  );

  context.setLineDash([]);

  context.save();
  context.globalAlpha = style.backdrop.alpha * dealProgress;
  context.fillStyle = privilegeRgba(style.backdrop.color, 1);
  context.fillRect(frame.x, frame.y, frame.width, frame.height);
  context.restore();

  const cardCenterX = card.x + card.width * 0.5;
  const cardCenterY = card.y + card.height * 0.5;
  context.save();
  context.translate(cardCenterX, cardCenterY);
  context.scale(
    privilegeMix(0.94, 1, dealProgress),
    privilegeMix(0.86, 1, dealProgress),
  );
  context.translate(-cardCenterX, -cardCenterY);
  context.globalAlpha *= dealProgress;

  privilegeTraceCutCard(
    context,
    card.x,
    card.y,
    card.width,
    card.height,
    card.cornerCut,
  );
  const surfaceGradient = context.createLinearGradient(
    card.x,
    card.y,
    card.x,
    card.y + card.height,
  );
  surfaceGradient.addColorStop(0, privilegeRgba(style.surface.topColor, style.surface.alpha));
  surfaceGradient.addColorStop(1, privilegeRgba(style.surface.bottomColor, style.surface.alpha));
  context.fillStyle = surfaceGradient;
  context.fill();

  const contentCard = privilegeGetInnerContentCard(card, scale);
  context.save();
  privilegeTraceCutCard(
    context,
    contentCard.x,
    contentCard.y,
    contentCard.width,
    contentCard.height,
    contentCard.cornerCut,
  );
  context.clip();

  if (heavyLayerCache) {
    privilegeDrawCachedCardLayer(
      context,
      heavyLayerCache.chartCanvas,
      card,
      chartProgress,
      "screen",
    );
  } else {
    privilegeDrawCardChartFragment(
      context,
      card,
      scale,
      chartProgress,
      plateRevision,
    );
  }

  const titleShade = context.createLinearGradient(
    card.x,
    card.y + card.height * 0.42,
    card.x,
    card.y + card.height * 0.67,
  );
  titleShade.addColorStop(0, "rgba(0,0,0,0)");
  titleShade.addColorStop(0.42, "rgba(0,0,0,0.82)");
  titleShade.addColorStop(1, "rgba(0,0,0,0.96)");
  context.fillStyle = titleShade;
  context.fillRect(
    card.x,
    card.y + card.height * 0.40,
    card.width,
    card.height * 0.31,
  );

  if (heavyLayerCache) {
    privilegeDrawCachedCardLayer(
      context,
      heavyLayerCache.typographyCanvas,
      card,
      textProgress,
    );
  } else {
    privilegeDrawCardTypography(context, card, result, scale, textProgress);
  }
  context.restore();

  privilegeDrawBorders(context, card, scale, dealProgress);
  context.restore();
};

// #endregion [CARD F02]
