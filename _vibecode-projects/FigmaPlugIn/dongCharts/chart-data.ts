namespace DongChart {
  const CATEGORY_KEYS = ['category', '类别', '类目', 'name', '名称', 'date', '日期', 'month', '月份', 'x'];

  export function parseDataset(input: string, paletteId: PaletteId = 'category'): ChartDataset {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new Error('请输入 CSV 或 JSON 数据。');
    }

    const rows = trimmed.startsWith('{') || trimmed.startsWith('[')
      ? parseJsonRows(trimmed)
      : parseCsvRows(trimmed);

    return normalizeRows(rows, paletteId);
  }

  export function formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 10000) return `${trimZeros(value / 10000)}万`;
    if (abs >= 1000) return Math.round(value).toLocaleString('en-US');
    if (abs >= 100) return String(Math.round(value));
    if (Number.isInteger(value)) return String(value);
    return trimZeros(value);
  }

  export function getDonutData(dataset: ChartDataset, paletteId: PaletteId = 'category'): Array<{ name: string; value: number; color: string; colorToken: string }> {
    const primary = dataset.series[0];
    if (!primary) return [];

    return dataset.categories
      .map((category, index) => {
        const c = paletteColor(paletteId, index);
        return {
          name: category,
          value: Math.max(0, primary.values[index] ?? 0),
          color: c.value,
          colorToken: c.token,
        };
      })
      .filter((item) => item.value > 0);
  }

  export function validateDatasetForChart(dataset: ChartDataset, chartType: ChartType): void {
    if (isRadarChart(chartType)) {
      if (dataset.categories.length < 3) throw new Error('雷达图至少需要 3 个维度。');
      if (dataset.categories.length > 10) throw new Error('雷达图单图维度不应超过 10 个。');
      if (dataset.series.length > 5) throw new Error('雷达图单图系列不应超过 5 个。');
      return;
    }
    if (chartType === 'scatter') {
      if (dataset.series.length < 1) throw new Error('散点图至少需要 1 个指标字段。');
      if (dataset.categories.length < 12) throw new Error('散点图建议至少 12 个数据点。');
      return;
    }
    if (chartType === 'bubble') {
      if (dataset.series.length < 3) throw new Error('气泡图至少需要 X值、Y值 和 气泡大小 三个数值字段。');
      if (dataset.series.length % 3 !== 0) throw new Error('气泡图每个类型需要按 X值、Y值、气泡大小 三列成组。');
      if (dataset.categories.length < 12) throw new Error('气泡图建议至少 12 个数据点。');
      const sizeValues = dataset.series
        .filter((_, index) => index % 3 === 2)
        .flatMap((series) => series.values);
      if (sizeValues.some((value) => value < 0)) throw new Error('气泡大小字段必须为非负数值。');
      return;
    }
    if (isFunnelLikeChart(chartType)) {
      if (dataset.series.length < 1) throw new Error('漏斗图至少需要 1 个指标字段。');
      if (dataset.categories.length < 3) throw new Error('漏斗图阶段数量至少为 3 个。');
      if (dataset.categories.length > 6) throw new Error('漏斗图阶段数量最多为 6 个。');
      const values = dataset.series[0].values;
      if (values.some((value) => value < 0)) throw new Error('漏斗图指标值必须为非负数值。');
    }
  }

  function normalizeRows(rows: ParsedDatum[], paletteId: PaletteId): ChartDataset {
    const categories = rows.map((row, index) => row.category || `类别 ${index + 1}`);
    const seriesNames = Array.from(new Set(rows.flatMap((row) => Object.keys(row.values))));

    if (categories.length === 0 || seriesNames.length === 0) {
      throw new Error('数据至少需要 1 个类目字段和 1 个数值字段。');
    }

    const series = seriesNames.map((name, index) => {
      const c = paletteColor(paletteId, index);
      return {
        name,
        values: rows.map((row) => Number.isFinite(row.values[name]) ? row.values[name] : 0),
        color: c.value,
        colorToken: c.token,
      };
    });

    return {
      title: series.length === 1 ? `${series[0].name} 趋势` : '业务指标趋势',
      categories,
      series,
    };
  }

  function parseCsvRows(input: string): ParsedDatum[] {
    const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) {
      throw new Error('CSV 至少需要表头和一行数据。');
    }

    const headers = parseCsvLine(lines[0]);
    const valueHeaders = headers.slice(1);
    if (headers.length < 2) {
      throw new Error('CSV 第一列为类目，后续列为数值系列。');
    }

    return lines.slice(1).map((line, rowIndex) => {
      const cells = parseCsvLine(line);
      const values: Record<string, number> = {};
      valueHeaders.forEach((header, index) => {
        const raw = cells[index + 1];
        const value = Number(raw);
        if (raw !== undefined && raw !== '' && Number.isFinite(value)) {
          values[header || `系列 ${index + 1}`] = value;
        }
      });

      return {
        category: cells[0] || `类别 ${rowIndex + 1}`,
        values,
      };
    });
  }

  function parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const next = line[index + 1];

      if (char === '"' && inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  function parseJsonRows(input: string): ParsedDatum[] {
    const parsed = JSON.parse(input) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => normalizeJsonObject(item, index));
    }

    if (isRecord(parsed) && Array.isArray(parsed.categories) && Array.isArray(parsed.series)) {
      const categories = parsed.categories.map((item) => String(item));
      const series = parsed.series.filter(isRecord);
      return categories.map((category, categoryIndex) => {
        const values: Record<string, number> = {};
        series.forEach((item, seriesIndex) => {
          const name = String(item.name ?? `系列 ${seriesIndex + 1}`);
          const seriesValues = Array.isArray(item.values) ? item.values : [];
          values[name] = toNumber(seriesValues[categoryIndex]);
        });
        return { category, values };
      });
    }

    throw new Error('JSON 支持对象数组，或 { categories, series } 结构。');
  }

  function normalizeJsonObject(item: unknown, rowIndex: number): ParsedDatum {
    if (!isRecord(item)) {
      throw new Error('JSON 数组中的每一项都需要是对象。');
    }

    const keys = Object.keys(item);
    const categoryKey = CATEGORY_KEYS.find((key) => key in item)
      ?? keys.find((key) => !isNumericLike(item[key]))
      ?? keys[0];
    const values: Record<string, number> = {};

    keys.forEach((key) => {
      if (key === categoryKey) return;
      if (isNumericLike(item[key])) values[key] = toNumber(item[key]);
    });

    return {
      category: String(item[categoryKey] ?? `类别 ${rowIndex + 1}`),
      values,
    };
  }

  function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  function isNumericLike(value: unknown): boolean {
    return value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value));
  }

  function toNumber(value: unknown): number {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  function trimZeros(value: number): string {
    return Number(value.toFixed(2)).toString();
  }

  // ============== 数据生成器 ==============

  export interface GenerateOptions {
    chartType: ChartType;
    dimensions: number; // 类目数量
    measures: number; // 指标(系列)数量；饼图 / 环形图忽略，固定为 1
    distribution: DistributionShape;
  }

  export function generateDataset(options: GenerateOptions): string {
    const dim = clamp(Math.round(options.dimensions), minDimensionFor(options.chartType), maxDimensionFor(options.chartType));
    const isPie = isPieLikeChart(options.chartType);
    const isFunnel = isFunnelLikeChart(options.chartType);
    const mes = isFunnel
      ? 1
      : isScatterLikeChart(options.chartType)
      ? clamp(Math.round(options.measures), 1, 4)
      : (fixedMeasureCount(options.chartType) ?? (isPie ? 1 : clamp(Math.round(options.measures), 1, maxMeasureFor(options.chartType))));

    if (isScatterLikeChart(options.chartType)) {
      return generateScatterDataset(options.chartType, dim, mes, options.distribution);
    }

    const categories = buildCategories(options.chartType, dim);
    const seriesNames = buildSeriesNames(options.chartType, mes);

    // CSV 输出：表头 + 行
    const header = ['类别', ...seriesNames].join(',');
    const lines: string[] = [header];

    const seriesValues: number[][] = [];
    for (let s = 0; s < mes; s += 1) {
      seriesValues.push(isFunnel ? generateFunnelShape(dim) : generateShape(options.distribution, dim, s));
    }

    for (let i = 0; i < dim; i += 1) {
      const row: string[] = [categories[i]];
      for (let s = 0; s < mes; s += 1) {
        row.push(String(seriesValues[s][i]));
      }
      lines.push(row.join(','));
    }
    return lines.join('\n');
  }

  function generateScatterDataset(type: ChartType, sampleCount: number, metricTypes: number, distribution: DistributionShape): string {
    const categories = buildCategories(type, sampleCount);
    if (type === 'bubble') {
      const headers = ['样本'];
      const groups = Array.from({ length: metricTypes }, (_, index) => {
        const prefix = metricTypes === 1 ? '' : `类型 ${index + 1} `;
        headers.push(`${prefix}X值`, `${prefix}Y值`, `${prefix}气泡大小`);
        return generateScatterPointRows(sampleCount, distribution, index);
      });
      const lines = [headers.join(',')];
      for (let i = 0; i < sampleCount; i += 1) {
        const row: string[] = [categories[i]];
        groups.forEach((points) => {
          const point = points[i];
          row.push(String(point.x), String(point.y), String(point.size));
        });
        lines.push(row.join(','));
      }
      return lines.join('\n');
    }

    const seriesNames = buildSeriesNames(type, metricTypes);
    const valuesByMetric = Array.from({ length: metricTypes }, (_, index) => (
      generateScatterPointRows(sampleCount, distribution, index).map((point) => point.y)
    ));
    const lines = [['样本', ...seriesNames].join(',')];
    for (let i = 0; i < sampleCount; i += 1) {
      lines.push([categories[i], ...valuesByMetric.map((values) => values[i])].join(','));
    }
    return lines.join('\n');
  }

  function generateScatterPointRows(sampleCount: number, distribution: DistributionShape, seriesIndex: number): Array<{ x: number; y: number; size: number }> {
    const noiseAmp = 10 + seriesIndex * 2;
    const noise = () => (Math.random() - 0.5) * noiseAmp;
    const rows: Array<{ x: number; y: number; size: number }> = [];

    for (let i = 0; i < sampleCount; i += 1) {
      const t = sampleCount === 1 ? 0 : i / (sampleCount - 1);
      const x = Math.round(clamp(10 + t * 90 + noise() * 0.35, 5, 100));
      let y: number;
      switch (distribution) {
        case 'positive-correlation':
        case 'uptrend':
          y = 20 + t * 70 + noise();
          break;
        case 'negative-correlation':
        case 'downtrend':
          y = 90 - t * 70 + noise();
          break;
        case 'u-shape':
        case 'valley':
          y = 25 + Math.pow((t - 0.5) * 2, 2) * 65 + noise();
          break;
        case 'random':
        default:
          y = 20 + Math.random() * 70 + noise();
          break;
      }
      rows.push({
        x,
        y: Math.round(clamp(y + seriesIndex * 4, 5, 100)),
        size: Math.round(clamp(80 + Math.random() * 340 + seriesIndex * 30, 40, 520)),
      });
    }

    return rows;
  }

  function buildCategories(type: ChartType, dim: number): string[] {
    if (isPieLikeChart(type)) {
      const base = ['一类', '二类', '三类', '四类', '五类', '六类', '七类', '八类', '九类', '十类'];
      return Array.from({ length: dim }, (_, i) => base[i] ?? `类别${i + 1}`);
    }
    if (isScatterLikeChart(type)) {
      return Array.from({ length: dim }, (_, i) => `点${i + 1}`);
    }
    if (isFunnelLikeChart(type)) {
      const base = ['访问首页', '浏览商详', '加入购物车', '提交订单', '支付成功', '复购'];
      return Array.from({ length: dim }, (_, i) => base[i] ?? `阶段${i + 1}`);
    }
    if (chartFamily(type) === 'line') {
      // 月份序列
      return Array.from({ length: dim }, (_, i) => `${i + 1}月`);
    }
    // bar - 季度/品类
    const base = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'];
    return Array.from({ length: dim }, (_, i) => base[i] ?? `T${i + 1}`);
  }

  function buildSeriesNames(type: ChartType, mes: number): string[] {
    const pool = ['销售额', '订单量', '访客数', '转化率', '客单价', '复购率'];
    if (isPieLikeChart(type)) return [pool[0]];
    if (type === 'scatter') return Array.from({ length: mes }, (_, i) => `类型 ${i + 1}`);
    if (type === 'bubble') return ['X值', 'Y值', '气泡大小'];
    if (isFunnelLikeChart(type)) return ['人数'];
    return Array.from({ length: mes }, (_, i) => pool[i] ?? `指标${i + 1}`);
  }

  function fixedMeasureCount(type: ChartType): number | null {
    if (type === 'bubble') return 3;
    return null;
  }

  function minDimensionFor(type: ChartType): number {
    if (isRadarChart(type)) return 3;
    if (isFunnelLikeChart(type)) return 3;
    if (isScatterLikeChart(type)) return 12;
    return 2;
  }

  function maxDimensionFor(type: ChartType): number {
    if (isRadarChart(type)) return 10;
    if (isFunnelLikeChart(type)) return 6;
    if (isScatterLikeChart(type)) return 48;
    return 24;
  }

  function maxMeasureFor(type: ChartType): number {
    if (isFunnelLikeChart(type)) return 6;
    if (isRadarChart(type)) return 5;
    return 6;
  }

  function clamp(v: number, min: number, max: number): number {
    if (!Number.isFinite(v)) return min;
    return Math.max(min, Math.min(max, v));
  }

  /**
   * 根据形态生成长度为 n 的整数序列。
   * seriesIndex 用作随机偏移，使多指标之间形态相似但数值不同。
   */
  function generateShape(shape: DistributionShape, n: number, seriesIndex: number): number[] {
    const base = 100 + seriesIndex * 30;
    const amp = 60 + seriesIndex * 10;
    const noise = () => (Math.random() - 0.5) * amp * 0.25;
    const out: number[] = [];

    for (let i = 0; i < n; i += 1) {
      const t = n === 1 ? 0 : i / (n - 1); // 0..1
      let v = base;
      switch (shape) {
        case 'uptrend':
          v = base + amp * t + noise();
          break;
        case 'downtrend':
          v = base + amp * (1 - t) + noise();
          break;
        case 'peak': {
          // 高斯峰，中点最高
          const g = Math.exp(-Math.pow((t - 0.5) / 0.22, 2));
          v = base + amp * g + noise();
          break;
        }
        case 'valley': {
          const g = Math.exp(-Math.pow((t - 0.5) / 0.22, 2));
          v = base + amp * (1 - g) + noise();
          break;
        }
        case 'wave-up': {
          // 升浪：整体上升 + 正弦波
          const wave = Math.sin(t * Math.PI * 2.5) * 0.35;
          v = base + amp * (t + wave) + noise();
          break;
        }
        case 'wave-down': {
          const wave = Math.sin(t * Math.PI * 2.5) * 0.35;
          v = base + amp * ((1 - t) + wave) + noise();
          break;
        }
        case 'random':
        default:
          v = base + (Math.random() - 0.2) * amp + noise();
          break;
      }
      out.push(Math.max(1, Math.round(v)));
    }
    return out;
  }

  function generateFunnelShape(n: number): number[] {
    const safeCount = Math.max(1, n);
    const maxValue = 100;
    const minRatio = 0.2;
    const step = safeCount === 1 ? 0 : (1 - minRatio) / (safeCount - 1);
    return Array.from({ length: safeCount }, (_, index) => {
      const ratio = Math.max(minRatio, 1 - index * step);
      const value = maxValue * ratio;
      return Math.max(1, Number(value.toFixed(2)));
    });
  }
}
