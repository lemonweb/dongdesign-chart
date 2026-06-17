/// <reference path="./theme.ts" />
/// <reference path="./chart-data.ts" />
/// <reference path="./code-export.ts" />
/// <reference path="./renderer.ts" />

// 图表生成插件主入口
const DEFAULT_UI_SIZE = { w: 460, h: 940 };
const MIN_UI_SIZE = { w: 380, h: 600 };
const MAX_UI_SIZE = { w: 1200, h: 1400 };
const SIZE_KEY = 'dongCharts.ui.size';

figma.showUI(__html__, { width: DEFAULT_UI_SIZE.w, height: DEFAULT_UI_SIZE.h, themeColors: true });

// 启动时尝试恢复上次窗口尺寸
(async () => {
  try {
    const saved = await figma.clientStorage.getAsync(SIZE_KEY);
    if (saved && typeof saved.w === 'number' && typeof saved.h === 'number') {
      const w = clampSize(saved.w, MIN_UI_SIZE.w, MAX_UI_SIZE.w);
      const h = clampSize(saved.h, MIN_UI_SIZE.h, MAX_UI_SIZE.h);
      figma.ui.resize(w, h);
      figma.ui.postMessage({ type: 'init-size', w, h });
    } else {
      figma.ui.postMessage({ type: 'init-size', w: DEFAULT_UI_SIZE.w, h: DEFAULT_UI_SIZE.h });
    }
  } catch (_e) {
    figma.ui.postMessage({ type: 'init-size', w: DEFAULT_UI_SIZE.w, h: DEFAULT_UI_SIZE.h });
  }
})();

function clampSize(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, Math.round(v)));
}

const fontCache = new Set<string>();

async function ensureFont(family: string, style: string): Promise<void> {
  const key = `${family}__${style}`;
  if (fontCache.has(key)) return;
  await figma.loadFontAsync({ family, style });
  fontCache.add(key);
}

async function preloadFonts(): Promise<void> {
  await ensureFont('Inter', 'Regular');
  await ensureFont('Inter', 'Semi Bold');
}

interface UIMessage {
  type: 'generate' | 'cancel' | 'resize' | 'generate-data' | 'export-code';
  payload?: DongChart.ChartOptions;
  size?: { w: number; h: number };
  generate?: DongChart.GenerateOptions;
}

figma.ui.onmessage = async (msg: UIMessage) => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
    return;
  }

  if (msg.type === 'resize' && msg.size) {
    const w = clampSize(msg.size.w, MIN_UI_SIZE.w, MAX_UI_SIZE.w);
    const h = clampSize(msg.size.h, MIN_UI_SIZE.h, MAX_UI_SIZE.h);
    figma.ui.resize(w, h);
    try {
      await figma.clientStorage.setAsync(SIZE_KEY, { w, h });
    } catch (_e) {
      // ignore
    }
    return;
  }

  if (msg.type === 'generate-data' && msg.generate) {
    try {
      const csv = DongChart.generateDataset(msg.generate);
      figma.ui.postMessage({ type: 'generate-data-success', csv });
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成数据失败';
      figma.ui.postMessage({ type: 'generate-data-error', message });
    }
    return;
  }

  if (msg.type === 'export-code' && msg.payload) {
    try {
      const dataset = DongChart.parseDataset(msg.payload.dataText, msg.payload.palette);
      const result = DongChart.exportChartCode(dataset, msg.payload);
      figma.ui.postMessage({
        type: 'export-code-success',
        engine: result.engine,
        language: result.language,
        code: result.code,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成代码失败';
      figma.ui.postMessage({ type: 'export-code-error', message });
    }
    return;
  }

  if (msg.type === 'generate' && msg.payload) {
    try {
      await preloadFonts();
      const dataset = DongChart.parseDataset(msg.payload.dataText, msg.payload.palette);
      const frame = await DongChart.renderChart(dataset, msg.payload, ensureFont);
      // 放置到当前视图中心
      const viewport = figma.viewport.center;
      frame.x = Math.round(viewport.x - frame.width / 2);
      frame.y = Math.round(viewport.y - frame.height / 2);
      figma.currentPage.appendChild(frame);
      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);
      figma.notify(`已生成 ${frame.name}`);
      figma.ui.postMessage({ type: 'generate-success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成失败';
      figma.notify(`⚠️ ${message}`, { error: true });
      figma.ui.postMessage({ type: 'generate-error', message });
    }
  }
};