import { useMemo, useState } from "react";
import {
  ColorToken,
  PaletteParams,
  PaletteType,
  SimulationMode,
  applySimulation,
  contrastRatio,
  deltaE2000,
  exportCssVariables,
  exportEchartsTheme,
  exportJsonTokens,
  generatePalette,
  minDeltaE,
  round,
  scorePalette
} from "./lib/color";

const PALETTE_TYPES: Array<{ value: PaletteType; label: string; note: string }> = [
  { value: "categorical", label: "分类色板", note: "柱状图、折线图、多系列对比" },
  { value: "sequential", label: "顺序色板", note: "热力图、地图、数值强弱" },
  { value: "diverging", label: "发散色板", note: "正负变化、偏离、盈亏" },
  { value: "semantic", label: "语义色板", note: "状态、风险、成功、告警" }
];

const SIMULATION_MODES: Array<{ value: SimulationMode; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
  { value: "grayscale", label: "Grayscale" },
  { value: "lowContrast", label: "Low Contrast" }
];

const chartData = [42, 66, 52, 78, 63, 91, 74, 86, 58, 96, 82, 69];
const lineData = [32, 43, 39, 51, 48, 62, 72, 68, 75, 81, 79, 88];

function Icon({
  type,
  className = ""
}: {
  type: "lab" | "copy" | "download" | "lock" | "refresh" | "alert" | "check";
  className?: string;
}) {
  const common = {
    className: `icon ${className}`,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true
  };
  const paths = {
    lab: (
      <>
        <path d="M9 3h6" />
        <path d="M10 3v5l-5.5 9.5A2.2 2.2 0 0 0 6.4 21h11.2a2.2 2.2 0 0 0 1.9-3.5L14 8V3" />
        <path d="M7.2 16h9.6" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    refresh: (
      <>
        <path d="M21 12a9 9 0 0 1-15.2 6.5" />
        <path d="M3 12A9 9 0 0 1 18.2 5.5" />
        <path d="M18 2v4h-4" />
        <path d="M6 22v-4h4" />
      </>
    ),
    alert: (
      <>
        <path d="M10.3 4.1 2.7 18a2 2 0 0 0 1.8 3h15a2 2 0 0 0 1.8-3L13.7 4.1a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
    check: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    )
  };

  return <svg {...common}>{paths[type]}</svg>;
}

function ControlPanel({
  params,
  onChange,
  onRandomize
}: {
  params: PaletteParams;
  onChange: (params: PaletteParams) => void;
  onRandomize: () => void;
}) {
  const update = <K extends keyof PaletteParams>(key: K, value: PaletteParams[K]) =>
    onChange({ ...params, [key]: value });

  return (
    <aside className="panel control-panel" aria-label="色板生成参数">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Generator</p>
          <h2>生成参数</h2>
        </div>
        <button className="icon-button" type="button" onClick={onRandomize} aria-label="随机生成色板">
          <Icon type="refresh" />
        </button>
      </div>

      <section className="control-section">
        <h3>色板类型</h3>
        <div className="type-grid" role="radiogroup" aria-label="色板类型">
          {PALETTE_TYPES.map((item) => (
            <button
              className="type-card"
              data-selected={params.type === item.value}
              key={item.value}
              type="button"
              onClick={() => update("type", item.value)}
              aria-pressed={params.type === item.value}
            >
              <span>{item.label}</span>
              <small>{item.note}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="control-section">
        <h3>色彩空间</h3>
        <div className="field-row">
          <label htmlFor="space">工作空间</label>
          <select id="space" value="OKLCH" aria-label="色彩空间" onChange={() => undefined}>
            <option>OKLCH</option>
            <option>OKLab</option>
            <option>Lab</option>
            <option>LCH</option>
            <option>HSL</option>
          </select>
        </div>
        <div className="field-row">
          <label htmlFor="gamut">色域</label>
          <select id="gamut" value="sRGB" aria-label="色域" onChange={() => undefined}>
            <option>sRGB</option>
            <option>Display P3</option>
          </select>
        </div>
      </section>

      <section className="control-section">
        <h3>OKLCH 参数</h3>
        <RangeField label="颜色数量" min={3} max={16} step={1} value={params.count} onChange={(v) => update("count", v)} />
        <RangeField label="Hue" min={0} max={360} step={1} value={params.baseHue} onChange={(v) => update("baseHue", v)} unit="deg" />
        <RangeField label="Hue Step" min={8} max={96} step={1} value={params.hueStep} onChange={(v) => update("hueStep", v)} unit="deg" />
        <RangeField label="Lightness" min={35} max={82} step={1} value={params.lightness} onChange={(v) => update("lightness", v)} />
        <RangeField label="Chroma" min={0.04} max={0.22} step={0.005} value={params.chroma} onChange={(v) => update("chroma", v)} />
        <RangeField
          label="Lightness Range"
          min={4}
          max={44}
          step={1}
          value={params.lightnessRange}
          onChange={(v) => update("lightnessRange", v)}
        />
        <RangeField
          label="Chroma Range"
          min={0.01}
          max={0.16}
          step={0.005}
          value={params.chromaRange}
          onChange={(v) => update("chromaRange", v)}
        />
      </section>
    </aside>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-field">
      <span>
        {label}
        <strong>
          {round(value, step < 1 ? 3 : 0)}
          {unit}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event: { target: { value: string } }) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function PaletteStrip({ tokens, simulation }: { tokens: ColorToken[]; simulation: SimulationMode }) {
  return (
    <section className="card palette-card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Current Palette</p>
          <h2>当前色板</h2>
        </div>
        <span className="status-pill">OKLCH generated</span>
      </div>
      <div className="swatch-grid">
        {tokens.map((token, index) => {
          const visibleHex = applySimulation(token.hex, simulation);
          return (
            <article className="swatch" key={token.id}>
              <div className="swatch-color" style={{ background: visibleHex }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="swatch-meta">
                <strong>{token.hex}</strong>
                <span>
                  L {round(token.oklch.l, 1)} / C {round(token.oklch.c, 3)}
                </span>
              </div>
              <button className="mini-button" type="button" aria-label={`复制 ${token.hex}`}>
                <Icon type="copy" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ChartPreview({ tokens, simulation }: { tokens: ColorToken[]; simulation: SimulationMode }) {
  const colors = tokens.map((token) => applySimulation(token.hex, simulation));
  const maxBar = Math.max(...chartData);
  const lineMax = Math.max(...lineData);
  const linePoints = lineData
    .map((value, index) => {
      const x = 42 + index * (430 / (lineData.length - 1));
      const y = 162 - (value / lineMax) * 112;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="card chart-card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Real Chart Preview</p>
          <h2>图表场景验证</h2>
        </div>
        <div className="legend-row">
          <span><i style={{ background: colors[0] }} /> GMV</span>
          <span><i style={{ background: colors[1] }} /> Conversion</span>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-box">
          <h3>柱状图 / 分类色</h3>
          <svg viewBox="0 0 520 190" role="img" aria-label="使用当前色板生成的柱状图预览">
            {[0, 1, 2, 3].map((tick) => (
              <line key={tick} x1="34" x2="492" y1={42 + tick * 34} y2={42 + tick * 34} className="grid-line" />
            ))}
            {chartData.map((value, index) => {
              const height = (value / maxBar) * 116;
              return (
                <rect
                  key={index}
                  x={42 + index * 38}
                  y={162 - height}
                  width="22"
                  height={height}
                  rx="3"
                  fill={colors[index % colors.length]}
                />
              );
            })}
            <line x1="34" x2="492" y1="162" y2="162" className="axis-line" />
          </svg>
        </div>
        <div className="chart-box">
          <h3>折线图 / 多系列识别</h3>
          <svg viewBox="0 0 520 190" role="img" aria-label="使用当前色板生成的折线图预览">
            {[0, 1, 2, 3].map((tick) => (
              <line key={tick} x1="34" x2="492" y1={42 + tick * 34} y2={42 + tick * 34} className="grid-line" />
            ))}
            <polyline points={linePoints} fill="none" stroke={colors[0]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <polyline
              points={lineData
                .map((value, index) => {
                  const x = 42 + index * (430 / (lineData.length - 1));
                  const y = 170 - ((value * 0.78 + 18) / lineMax) * 112;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke={colors[1] ?? colors[0]}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="34" x2="492" y1="162" y2="162" className="axis-line" />
          </svg>
        </div>
        <div className="chart-box wide">
          <h3>热力图 / 顺序强弱</h3>
          <div className="heatmap" role="img" aria-label="使用当前色板生成的热力图预览">
            {Array.from({ length: 56 }, (_, index) => (
              <span key={index} style={{ background: colors[index % colors.length] }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalysisPanel({
  tokens,
  simulation,
  setSimulation
}: {
  tokens: ColorToken[];
  simulation: SimulationMode;
  setSimulation: (mode: SimulationMode) => void;
}) {
  const score = scorePalette(tokens);
  const risk = minDeltaE(tokens, simulation);
  const contrastPass = tokens.filter((token) => contrastRatio(token.hex, "#FFFFFF") >= 3).length;

  return (
    <aside className="panel analysis-panel" aria-label="验证分析">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Validation</p>
          <h2>验证分析</h2>
        </div>
        <div className={`grade grade-${score.grade.toLowerCase()}`}>{score.grade}</div>
      </div>

      <section className="score-card">
        <div>
          <span>综合评分</span>
          <strong>{score.score}</strong>
        </div>
        <div className="score-bar">
          <span style={{ width: `${score.score}%` }} />
        </div>
      </section>

      <section className="control-section">
        <h3>无障碍模拟</h3>
        <div className="mode-list">
          {SIMULATION_MODES.map((item) => (
            <button
              key={item.value}
              type="button"
              className="mode-button"
              data-selected={simulation === item.value}
              onClick={() => setSimulation(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="metric-list">
        <Metric label="最小 Delta E 2000" value={round(risk.value, 1)} tone={risk.value >= 20 ? "good" : "warn"} />
        <Metric label="普通视图最小距离" value={round(score.normal, 1)} tone={score.normal >= 24 ? "good" : "warn"} />
        <Metric label="色盲视图最小距离" value={round(score.protanopia, 1)} tone={score.protanopia >= 20 ? "good" : "warn"} />
        <Metric label="白底 3:1 通过" value={`${contrastPass}/${tokens.length}`} tone={contrastPass === tokens.length ? "good" : "warn"} />
      </section>

      <section className="diagnosis">
        <h3>问题诊断</h3>
        <div className="diagnosis-item">
          {risk.value >= 20 ? <Icon type="check" /> : <Icon type="alert" />}
          <p>
            风险颜色对：<strong>{risk.pair.join(" / ")}</strong>
            <span>
              {risk.value >= 20 ? "当前模拟模式下可接受。" : "建议拉开明度或色相距离。"}
            </span>
          </p>
        </div>
        <div className="diagnosis-item">
          <Icon type={score.contrastPass >= 0.9 ? "check" : "alert"} />
          <p>
            WCAG 图形对比：<strong>{Math.round(score.contrastPass * 100)}%</strong>
            <span>数据图形建议至少达到 3:1，对文字标签保持 4.5:1。</span>
          </p>
        </div>
      </section>
    </aside>
  );
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone: "good" | "warn" }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong data-tone={tone}>{value}</strong>
    </div>
  );
}

function ColorSpaceAnalysis({ tokens }: { tokens: ColorToken[] }) {
  const cells = tokens.flatMap((first, row) =>
    tokens.map((second, col) => ({
      row,
      col,
      value: row === col ? 0 : deltaE2000(first.lab, second.lab)
    }))
  );

  return (
    <section className="card analysis-card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Color Science</p>
          <h2>色彩空间分析</h2>
        </div>
      </div>

      <div className="science-grid">
        <div className="science-box">
          <h3>Hue Wheel</h3>
          <div className="hue-wheel">
            {tokens.map((token) => {
              const radius = 84;
              const angle = (token.oklch.h - 90) * (Math.PI / 180);
              const x = 100 + Math.cos(angle) * radius;
              const y = 100 + Math.sin(angle) * radius;
              return <span key={token.id} style={{ left: x, top: y, background: token.hex }} title={token.hex} />;
            })}
          </div>
        </div>
        <div className="science-box">
          <h3>Lightness / Chroma</h3>
          <svg viewBox="0 0 220 200" className="lc-plot" role="img" aria-label="Lightness Chroma 散点图">
            <line x1="32" x2="204" y1="164" y2="164" className="axis-line" />
            <line x1="32" x2="32" y1="20" y2="164" className="axis-line" />
            {tokens.map((token) => (
              <circle
                key={token.id}
                cx={32 + (token.oklch.c / 0.28) * 168}
                cy={164 - (token.oklch.l / 100) * 132}
                r="6"
                fill={token.hex}
              />
            ))}
            <text x="112" y="192">Chroma</text>
            <text x="6" y="86" transform="rotate(-90 8 86)">Lightness</text>
          </svg>
        </div>
        <div className="science-box wide">
          <h3>Delta E 2000 距离矩阵</h3>
          <div className="matrix" style={{ gridTemplateColumns: `repeat(${tokens.length}, minmax(18px, 1fr))` }}>
            {cells.map((cell) => (
              <span
                key={`${cell.row}-${cell.col}`}
                style={{
                  background:
                    cell.row === cell.col
                      ? "#f1f5f9"
                      : cell.value < 10
                        ? "#fee2e2"
                        : cell.value < 20
                          ? "#fef3c7"
                          : "#dcfce7"
                }}
                title={`Delta E: ${round(cell.value, 1)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExportPanel({ tokens }: { tokens: ColorToken[] }) {
  const [format, setFormat] = useState<"css" | "json" | "echarts">("css");
  const output = {
    css: exportCssVariables(tokens),
    json: exportJsonTokens(tokens),
    echarts: exportEchartsTheme(tokens)
  }[format];

  return (
    <section className="card export-card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Token Export</p>
          <h2>导出</h2>
        </div>
        <button className="secondary-button" type="button">
          <Icon type="download" />
          Export
        </button>
      </div>
      <div className="tabs" role="tablist" aria-label="导出格式">
        {(["css", "json", "echarts"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className="tab-button"
            data-selected={format === item}
            onClick={() => setFormat(item)}
          >
            {item === "css" ? "CSS Variables" : item === "json" ? "JSON Token" : "ECharts Theme"}
          </button>
        ))}
      </div>
      <pre aria-label="导出内容">{output}</pre>
    </section>
  );
}

export default function App() {
  const [params, setParams] = useState<PaletteParams>({
    type: "categorical",
    count: 8,
    baseHue: 220,
    hueStep: 42,
    lightness: 62,
    chroma: 0.16,
    lightnessRange: 18,
    chromaRange: 0.06
  });
  const [simulation, setSimulation] = useState<SimulationMode>("normal");
  const tokens = useMemo(() => generatePalette(params), [params]);

  const randomize = () => {
    setParams((current) => ({
      ...current,
      baseHue: Math.round(Math.random() * 360),
      hueStep: Math.round(28 + Math.random() * 42),
      lightness: Math.round(52 + Math.random() * 18),
      chroma: round(0.11 + Math.random() * 0.08, 3)
    }));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><Icon type="lab" /></span>
          <div>
            <strong>PaletteLab</strong>
            <span>Data Visualization Color Science Workbench</span>
          </div>
        </div>
        <nav aria-label="主操作">
          <button type="button" className="nav-button">Import</button>
          <button type="button" className="nav-button">Save</button>
          <button type="button" className="primary-button">Export Theme</button>
        </nav>
      </header>

      <main className="workspace">
        <ControlPanel params={params} onChange={setParams} onRandomize={randomize} />
        <section className="workbench" aria-label="色板工作区">
          <PaletteStrip tokens={tokens} simulation={simulation} />
          <ChartPreview tokens={tokens} simulation={simulation} />
          <ColorSpaceAnalysis tokens={tokens} />
          <ExportPanel tokens={tokens} />
        </section>
        <AnalysisPanel tokens={tokens} simulation={simulation} setSimulation={setSimulation} />
      </main>
    </div>
  );
}
