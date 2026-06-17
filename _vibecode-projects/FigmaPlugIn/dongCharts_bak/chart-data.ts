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
        values[header || `系列 ${index + 1}`] = toNumber(cells[index + 1]);
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
    measures: number; // 指标(系列)数量；环形图忽略，固定为 1
    distribution: DistributionShape;
  }

  export function generateDataset(options: GenerateOptions): string {
    const dim = clamp(Math.round(options.dimensions), 2, 24);
    const isDonut = options.chartType === 'donut';
    const mes = isDonut ? 1 : clamp(Math.round(options.measures), 1, 6);

    const categories = buildCategories(options.chartType, dim);
    const seriesNames = buildSeriesNames(options.chartType, mes);

    // CSV 输出：表头 + 行
    const header = ['类别', ...seriesNames].join(',');
    const lines: string[] = [header];

    const seriesValues: number[][] = [];
    for (let s = 0; s < mes; s += 1) {
      seriesValues.push(generateShape(options.distribution, dim, s));
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

  function buildCategories(type: ChartType, dim: number): string[] {
    if (type === 'donut') {
      const base = ['一类', '二类', '三类', '四类', '五类', '六类', '七类', '八类', '九类', '十类'];
      return Array.from({ length: dim }, (_, i) => base[i] ?? `类别${i + 1}`);
    }
    if (type === 'line') {
      // 月份序列
      return Array.from({ length: dim }, (_, i) => `${i + 1}月`);
    }
    // bar - 季度/品类
    const base = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'];
    return Array.from({ length: dim }, (_, i) => base[i] ?? `T${i + 1}`);
  }

  function buildSeriesNames(type: ChartType, mes: number): string[] {
    const pool = ['销售额', '订单量', '访客数', '转化率', '客单价', '复购率'];
    if (type === 'donut') return [pool[0]];
    return Array.from({ length: mes }, (_, i) => pool[i] ?? `指标${i + 1}`);
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
}
