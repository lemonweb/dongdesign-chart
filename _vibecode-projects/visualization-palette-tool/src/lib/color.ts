export type PaletteType = "categorical" | "sequential" | "diverging" | "semantic";
export type SimulationMode =
  | "normal"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia"
  | "grayscale"
  | "lowContrast";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export interface Lab {
  l: number;
  a: number;
  b: number;
}

export interface PaletteParams {
  type: PaletteType;
  count: number;
  baseHue: number;
  hueStep: number;
  lightness: number;
  chroma: number;
  lightnessRange: number;
  chromaRange: number;
}

export interface ColorToken {
  id: string;
  name: string;
  hex: string;
  rgb: Rgb;
  hsl: Hsl;
  oklch: Oklch;
  lab: Lab;
  locked?: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const round = (value: number, digits = 2) => {
  const pow = 10 ** digits;
  return Math.round(value * pow) / pow;
};

export const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;

const srgbToLinear = (channel: number) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const linearToSrgb = (channel: number) => {
  const value =
    channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
  return clamp(Math.round(value * 255), 0, 255);
};

export const hexToRgb = (hex: string): Rgb => {
  const normalized = hex.replace("#", "").trim();
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6);
  const value = Number.parseInt(full, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
};

export const rgbToHex = ({ r, g, b }: Rgb) =>
  `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;

export const rgbToHsl = ({ r, g, b }: Rgb): Hsl => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === red) h = 60 * (((green - blue) / delta) % 6);
    if (max === green) h = 60 * ((blue - red) / delta + 2);
    if (max === blue) h = 60 * ((red - green) / delta + 4);
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h: normalizeHue(h), s: s * 100, l: l * 100 };
};

export const hslToRgb = ({ h, s, l }: Hsl): Rgb => {
  const sat = s / 100;
  const light = l / 100;
  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - chroma / 2;
  let partial = [0, 0, 0];
  if (h < 60) partial = [chroma, x, 0];
  else if (h < 120) partial = [x, chroma, 0];
  else if (h < 180) partial = [0, chroma, x];
  else if (h < 240) partial = [0, x, chroma];
  else if (h < 300) partial = [x, 0, chroma];
  else partial = [chroma, 0, x];
  return {
    r: (partial[0] + m) * 255,
    g: (partial[1] + m) * 255,
    b: (partial[2] + m) * 255
  };
};

export const rgbToOklab = ({ r, g, b }: Rgb) => {
  const red = srgbToLinear(r);
  const green = srgbToLinear(g);
  const blue = srgbToLinear(b);

  const l = 0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue;
  const m = 0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue;
  const s = 0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue;

  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  return {
    l: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot
  };
};

export const oklabToRgb = ({ l, a, b }: { l: number; a: number; b: number }): Rgb => {
  const lRoot = l + 0.3963377774 * a + 0.2158037573 * b;
  const mRoot = l - 0.1055613458 * a - 0.0638541728 * b;
  const sRoot = l - 0.0894841775 * a - 1.291485548 * b;

  const lLinear = lRoot ** 3;
  const mLinear = mRoot ** 3;
  const sLinear = sRoot ** 3;

  const red = 4.0767416621 * lLinear - 3.3077115913 * mLinear + 0.2309699292 * sLinear;
  const green = -1.2684380046 * lLinear + 2.6097574011 * mLinear - 0.3413193965 * sLinear;
  const blue = -0.0041960863 * lLinear - 0.7034186147 * mLinear + 1.707614701 * sLinear;

  return {
    r: linearToSrgb(red),
    g: linearToSrgb(green),
    b: linearToSrgb(blue)
  };
};

export const rgbToOklch = (rgb: Rgb): Oklch => {
  const lab = rgbToOklab(rgb);
  return {
    l: lab.l * 100,
    c: Math.sqrt(lab.a ** 2 + lab.b ** 2),
    h: normalizeHue((Math.atan2(lab.b, lab.a) * 180) / Math.PI)
  };
};

export const oklchToRgb = ({ l, c, h }: Oklch): Rgb => {
  const radians = (h * Math.PI) / 180;
  return oklabToRgb({
    l: l / 100,
    a: c * Math.cos(radians),
    b: c * Math.sin(radians)
  });
};

export const rgbToLab = ({ r, g, b }: Rgb): Lab => {
  const red = srgbToLinear(r);
  const green = srgbToLinear(g);
  const blue = srgbToLinear(b);
  const x = (0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / 0.95047;
  const y = 0.2126729 * red + 0.7151522 * green + 0.072175 * blue;
  const z = (0.0193339 * red + 0.119192 * green + 0.9503041 * blue) / 1.08883;
  const f = (value: number) =>
    value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116;
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  };
};

export const makeToken = (hex: string, index: number): ColorToken => {
  const rgb = hexToRgb(hex);
  return {
    id: `chart-color-${index + 1}`,
    name: `Color ${String(index + 1).padStart(2, "0")}`,
    hex: rgbToHex(rgb),
    rgb,
    hsl: rgbToHsl(rgb),
    oklch: rgbToOklch(rgb),
    lab: rgbToLab(rgb)
  };
};

export const generatePalette = (params: PaletteParams): ColorToken[] => {
  if (params.type === "semantic") {
    return ["#16A34A", "#D97706", "#DC2626", "#2563EB", "#64748B", "#0F766E", "#B91C1C"]
      .slice(0, params.count)
      .map(makeToken);
  }

  const colors = Array.from({ length: params.count }, (_, index) => {
    const t = params.count === 1 ? 0.5 : index / (params.count - 1);
    if (params.type === "sequential") {
      return rgbToHex(
        oklchToRgb({
          l: clamp(params.lightness - params.lightnessRange / 2 + params.lightnessRange * t, 32, 92),
          c: clamp(params.chroma - params.chromaRange / 2 + params.chromaRange * t, 0.02, 0.22),
          h: params.baseHue
        })
      );
    }

    if (params.type === "diverging") {
      const side = t < 0.5 ? -1 : 1;
      const distance = Math.abs(t - 0.5) * 2;
      return rgbToHex(
        oklchToRgb({
          l: clamp(params.lightness + (0.5 - distance) * params.lightnessRange, 35, 94),
          c: clamp(0.035 + params.chroma * distance, 0.02, 0.24),
          h: normalizeHue(params.baseHue + side * params.hueStep)
        })
      );
    }

    return rgbToHex(
      oklchToRgb({
        l: clamp(params.lightness + Math.sin(index * 1.73) * params.lightnessRange * 0.18, 42, 78),
        c: clamp(params.chroma + Math.cos(index * 1.17) * params.chromaRange * 0.14, 0.08, 0.24),
        h: normalizeHue(params.baseHue + index * params.hueStep)
      })
    );
  });

  return colors.map(makeToken);
};

export const relativeLuminance = ({ r, g, b }: Rgb) => {
  const red = srgbToLinear(r);
  const green = srgbToLinear(g);
  const blue = srgbToLinear(b);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const contrastRatio = (fg: string, bg: string) => {
  const l1 = relativeLuminance(hexToRgb(fg));
  const l2 = relativeLuminance(hexToRgb(bg));
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
};

export const deltaE76 = (first: Lab, second: Lab) =>
  Math.sqrt((first.l - second.l) ** 2 + (first.a - second.a) ** 2 + (first.b - second.b) ** 2);

export const deltaE2000 = (first: Lab, second: Lab) => {
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;
  const avgLp = (first.l + second.l) / 2;
  const c1 = Math.sqrt(first.a ** 2 + first.b ** 2);
  const c2 = Math.sqrt(second.a ** 2 + second.b ** 2);
  const avgC = (c1 + c2) / 2;
  const g = 0.5 * (1 - Math.sqrt(avgC ** 7 / (avgC ** 7 + 25 ** 7)));
  const a1p = (1 + g) * first.a;
  const a2p = (1 + g) * second.a;
  const c1p = Math.sqrt(a1p ** 2 + first.b ** 2);
  const c2p = Math.sqrt(a2p ** 2 + second.b ** 2);
  const avgCp = (c1p + c2p) / 2;
  const h1p = normalizeHue(Math.atan2(first.b, a1p) * rad2deg);
  const h2p = normalizeHue(Math.atan2(second.b, a2p) * rad2deg);
  const dhp =
    Math.abs(h1p - h2p) <= 180
      ? h2p - h1p
      : h2p <= h1p
        ? h2p - h1p + 360
        : h2p - h1p - 360;
  const dLp = second.l - first.l;
  const dCp = c2p - c1p;
  const dHp = 2 * Math.sqrt(c1p * c2p) * Math.sin((dhp / 2) * deg2rad);
  const avgHp =
    Math.abs(h1p - h2p) <= 180
      ? (h1p + h2p) / 2
      : h1p + h2p < 360
        ? (h1p + h2p + 360) / 2
        : (h1p + h2p - 360) / 2;
  const t =
    1 -
    0.17 * Math.cos((avgHp - 30) * deg2rad) +
    0.24 * Math.cos(2 * avgHp * deg2rad) +
    0.32 * Math.cos((3 * avgHp + 6) * deg2rad) -
    0.2 * Math.cos((4 * avgHp - 63) * deg2rad);
  const deltaTheta = 30 * Math.exp(-(((avgHp - 275) / 25) ** 2));
  const rc = 2 * Math.sqrt(avgCp ** 7 / (avgCp ** 7 + 25 ** 7));
  const sl = 1 + (0.015 * (avgLp - 50) ** 2) / Math.sqrt(20 + (avgLp - 50) ** 2);
  const sc = 1 + 0.045 * avgCp;
  const sh = 1 + 0.015 * avgCp * t;
  const rt = -Math.sin(2 * deltaTheta * deg2rad) * rc;
  return Math.sqrt(
    (dLp / sl) ** 2 + (dCp / sc) ** 2 + (dHp / sh) ** 2 + rt * (dCp / sc) * (dHp / sh)
  );
};

export const applySimulation = (hex: string, mode: SimulationMode) => {
  const rgb = hexToRgb(hex);
  const matrices: Record<Exclude<SimulationMode, "normal" | "grayscale" | "lowContrast">, number[][]> = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758]
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7]
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525]
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114]
    ]
  };

  if (mode === "normal") return hex;
  if (mode === "grayscale") {
    const value = Math.round(rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
    return rgbToHex({ r: value, g: value, b: value });
  }
  if (mode === "lowContrast") {
    return rgbToHex({
      r: rgb.r * 0.72 + 248 * 0.28,
      g: rgb.g * 0.72 + 250 * 0.28,
      b: rgb.b * 0.72 + 252 * 0.28
    });
  }

  const matrix = matrices[mode];
  return rgbToHex({
    r: rgb.r * matrix[0][0] + rgb.g * matrix[0][1] + rgb.b * matrix[0][2],
    g: rgb.r * matrix[1][0] + rgb.g * matrix[1][1] + rgb.b * matrix[1][2],
    b: rgb.r * matrix[2][0] + rgb.g * matrix[2][1] + rgb.b * matrix[2][2]
  });
};

export const minDeltaE = (tokens: ColorToken[], mode: SimulationMode = "normal") => {
  let min = Number.POSITIVE_INFINITY;
  let pair = ["-", "-"];
  for (let i = 0; i < tokens.length; i += 1) {
    for (let j = i + 1; j < tokens.length; j += 1) {
      const first = rgbToLab(hexToRgb(applySimulation(tokens[i].hex, mode)));
      const second = rgbToLab(hexToRgb(applySimulation(tokens[j].hex, mode)));
      const delta = deltaE2000(first, second);
      if (delta < min) {
        min = delta;
        pair = [tokens[i].hex, tokens[j].hex];
      }
    }
  }
  return { value: min === Number.POSITIVE_INFINITY ? 0 : min, pair };
};

export const scorePalette = (tokens: ColorToken[]) => {
  const normal = minDeltaE(tokens, "normal").value;
  const protanopia = minDeltaE(tokens, "protanopia").value;
  const grayscale = minDeltaE(tokens, "grayscale").value;
  const contrastPass = tokens.filter((token) => contrastRatio(token.hex, "#FFFFFF") >= 3).length / tokens.length;
  const distinctness = clamp(normal / 34, 0, 1) * 30;
  const accessibility = clamp(Math.min(protanopia, grayscale) / 26, 0, 1) * 25;
  const contrast = contrastPass * 20;
  const oklchLightness = tokens.map((token) => token.oklch.l);
  const lightnessSpread = Math.max(...oklchLightness) - Math.min(...oklchLightness);
  const uniformity = clamp(1 - Math.abs(lightnessSpread - 18) / 42, 0, 1) * 15;
  const chartFit = clamp(tokens.length / 10, 0.5, 1) * 10;
  const score = Math.round(distinctness + accessibility + contrast + uniformity + chartFit);
  const grade = score >= 90 ? "S" : score >= 78 ? "A" : score >= 64 ? "B" : score >= 50 ? "C" : "D";
  return { score, grade, normal, protanopia, grayscale, contrastPass };
};

export const exportCssVariables = (tokens: ColorToken[]) =>
  `:root {\n${tokens
    .map((token, index) => `  --chart-color-${index + 1}: ${token.hex};`)
    .join("\n")}\n}`;

export const exportJsonTokens = (tokens: ColorToken[]) =>
  JSON.stringify(
    {
      chart: Object.fromEntries(
        tokens.map((token, index) => [
          `color${index + 1}`,
          {
            value: token.hex,
            rgb: token.rgb,
            oklch: {
              l: round(token.oklch.l, 2),
              c: round(token.oklch.c, 4),
              h: round(token.oklch.h, 1)
            }
          }
        ])
      )
    },
    null,
    2
  );

export const exportEchartsTheme = (tokens: ColorToken[]) =>
  `const palette = ${JSON.stringify(tokens.map((token) => token.hex), null, 2)};\n\nexport default {\n  color: palette,\n  backgroundColor: '#FFFFFF',\n  textStyle: {\n    fontFamily: 'Fira Sans, Inter, system-ui, sans-serif'\n  }\n};`;
