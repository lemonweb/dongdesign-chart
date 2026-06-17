namespace DongChart {
  export const THEME = {
    name: 'dongDesign Chart Default',
    colors: {
      category: [
        { token: '分类色板/item-1', value: '#3365F7' },
        { token: '分类色板/item-2', value: '#30CAFA' },
        { token: '分类色板/item-3', value: '#0B2165' },
        { token: '分类色板/item-4', value: '#EF69CA' },
        { token: '分类色板/item-5', value: '#FFBA30' },
        { token: '分类色板/item-6', value: '#16C87F' },
        { token: '分类色板/item-7', value: '#482AC4' },
        { token: '分类色板/item-8', value: '#FF6D4E' },
        { token: '分类色板/item-9', value: '#B8CE92' },
        { token: '分类色板/item-10', value: '#004B91' },
        { token: '分类色板/item-11', value: '#008FCA' },
        { token: '分类色板/item-12', value: '#D1DEF3' },
      ],
      axisLine: { token: '坐标轴/axisLineColor', value: '#D9D9D9' },
      axisLabel: { token: '坐标轴/axisLabelColor', value: '#8C8C8C' },
      gridLine: { token: '坐标轴/splitLineColor', value: '#EBEBEB' },
      legendText: { token: '图例/legendTextColor', value: '#595959' },
      card: { token: '背景/cardColor', value: '#FFFFFF' },
      page: { token: '背景/页面背景', value: '#F7F7F7' },
      title: { token: 'text/400', value: '#262626' },
      textSecondary: { token: 'text/300', value: '#595959' },
    },
    typography: {
      title: { size: 14, lineHeight: 20, weight: 600 },
      bodySmall: { size: 12, lineHeight: 18, weight: 400 },
      numberSmall: { size: 12, lineHeight: 18, weight: 400 },
      numberSmallStrong: { size: 12, lineHeight: 18, weight: 600 },
      donutTotal: { size: 24, lineHeight: 32, weight: 600 },
      donutCaption: { size: 14, lineHeight: 20, weight: 400 },
    },
    spacing: {
      framePadding: 24,
      sectionGap: 14,
      legendItemGap: 20,
      legendItemGapVertical: 8,
      legendShapeGap: 5,
      // 坐标轴规范：指标轴标签右对齐，距离绘图区 8px；维度轴标签距离轴线 10px。
      axisLabelGap: 8,
      categoryAxisLabelGap: 10,
      cartesianTopInset: 12,
      cartesianRightInset: 0,
      cartesianNoAxisInset: 0,
      gridDash: [4, 4],
      barGap: 2,
      barCategoryGap: 8,
      labelGap: 8,
      donutCenterGap: 4,
    },
    chart: {
      minWidth: 320,
      maxWidth: 1200,
      minHeight: 240,
      maxHeight: 900,
      barMinWidth: 2,
      barMaxWidth: 40,
      donutInnerRatio: 0.7,
      areaOpacity: 0.18,
      // 折线图 / 柱状图统一开启类目轴留白，点位与柱组都落在类目 band 中心。
      categoryBoundaryGap: true,
    },
    legend: {
      // 遵循 wiki/01-design-language/legend.md
      rectSize: 10,
      rectRadius: 2,
      lineWidth: 10,
      lineHeight: 2,
      lineRadius: 2,
      dotSize: 10,
    },
    markerPoint: {
      size: 8,
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
    },
  } as const;

  // 色板字典（遵循 wiki/01-design-language/color.md + theme-token.md）
  // 除分类色板外，提供有序、发散、语义色板供选择
  export type PaletteId =
    | 'category'
    | 'sequential-blue'
    | 'sequential-green'
    | 'sequential-orange'
    | 'sequential-red'
    | 'diverging-5'
    | 'diverging-10'
    | 'semantic';

  export interface PaletteMeta {
    id: PaletteId;
    label: string;
    tokenPrefix: string;
    colors: string[];
  }

  export const PALETTES: PaletteMeta[] = [
    {
      id: 'category',
      label: '分类色板',
      tokenPrefix: '分类色板/item-',
      colors: THEME.colors.category.map((c) => c.value),
    },
    {
      id: 'sequential-blue',
      label: '有序色板 · 蓝',
      tokenPrefix: '有序色板/蓝 blue/',
      colors: ['#DFE8FE', '#CBDEFD', '#A8C8FC', '#84B1FA', '#6F97F9', '#4881FC', '#3365F7', '#0C57CD', '#0945A5', '#083480'],
    },
    {
      id: 'sequential-green',
      label: '有序色板 · 绿',
      tokenPrefix: '有序色板/绿 green/',
      colors: ['#C7F1D6', '#A0EDC0', '#67DDA1', '#00CA85', '#00B073', '#009A64', '#008455', '#006D45', '#005737', '#004128'],
    },
    {
      id: 'sequential-orange',
      label: '有序色板 · 橙',
      tokenPrefix: '有序色板/橙 orange/',
      colors: ['#FEF1E9', '#FCE4D3', '#FAD6BA', '#FFB87C', '#FB994C', '#EA7F1E', '#CF6B1B', '#B25A17', '#944B00', '#733E00'],
    },
    {
      id: 'sequential-red',
      label: '有序色板 · 红',
      tokenPrefix: '有序色板/红 red/',
      colors: ['#FFF0F0', '#FFD1CF', '#FFB2B0', '#F59494', '#EB787A', '#E5525C', '#CC3B47', '#B51C36', '#990026', '#75001C'],
    },
    {
      id: 'diverging-5',
      label: '发散色板 · 五色',
      tokenPrefix: '发散色板/五色发散/序列',
      colors: ['#055CC4', '#5085F4', '#52AD40', '#EDBF00', '#B51C36'],
    },
    {
      id: 'diverging-10',
      label: '发散色板 · 十色',
      tokenPrefix: '发散色板/十色发散/序列',
      colors: ['#083480', '#3365F7', '#6F97F9', '#A8C8FC', '#EFF3FF', '#FFF2DB', '#FFB87C', '#EA7F1E', '#BA1D00', '#961600'],
    },
    {
      id: 'semantic',
      label: '语义色板',
      tokenPrefix: '语义色板/',
      colors: ['#16C87F', '#FFA71A', '#F53333'],
    },
  ];

  export function getPalette(id: PaletteId): PaletteMeta {
    return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
  }

  export function paletteColor(id: PaletteId, index: number): { value: string; token: string } {
    const palette = getPalette(id);
    const value = palette.colors[index % palette.colors.length];
    let suffix: string;
    if (id === 'semantic') {
      suffix = ['normal', 'warning', 'danger'][index % 3];
    } else {
      suffix = String((index % palette.colors.length) + 1).padStart(id.startsWith('diverging') ? 2 : 1, '0');
    }
    return { value, token: `${palette.tokenPrefix}${suffix}` };
  }

  export type ChartType = 'line' | 'area' | 'stacked-area' | 'bar' | 'stacked-bar' | 'donut' | 'pie' | 'radar' | 'scatter' | 'bubble' | 'funnel' | 'convert-funnel';
  export type ChartFamily = 'line' | 'bar' | 'donut' | 'radar' | 'scatter' | 'funnel';

  export function chartFamily(type: ChartType): ChartFamily {
    if (type === 'area' || type === 'stacked-area') return 'line';
    if (type === 'stacked-bar') return 'bar';
    if (type === 'pie') return 'donut';
    if (type === 'bubble') return 'scatter';
    if (type === 'convert-funnel') return 'funnel';
    return type;
  }

  export function isLineLikeChart(type: ChartType): boolean {
    return chartFamily(type) === 'line';
  }

  export function isAreaChart(type: ChartType): boolean {
    return type === 'area' || type === 'stacked-area';
  }

  export function isStackedChart(type: ChartType): boolean {
    return type === 'stacked-area' || type === 'stacked-bar';
  }

  export function isPieLikeChart(type: ChartType): boolean {
    return chartFamily(type) === 'donut';
  }

  export function isRadarChart(type: ChartType): boolean {
    return chartFamily(type) === 'radar';
  }

  export function isScatterLikeChart(type: ChartType): boolean {
    return chartFamily(type) === 'scatter';
  }

  export function isFunnelLikeChart(type: ChartType): boolean {
    return chartFamily(type) === 'funnel';
  }

  export interface ChartSeries {
    name: string;
    values: number[];
    color: string;
    colorToken: string;
  }

  export interface ChartDataset {
    title: string;
    categories: string[];
    series: ChartSeries[];
  }

  export type LegendPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'left-center'
    | 'right-center';

  export type DistributionShape =
    | 'random'
    | 'uptrend'
    | 'downtrend'
    | 'peak'
    | 'valley'
    | 'wave-up'
    | 'wave-down'
    | 'positive-correlation'
    | 'negative-correlation'
    | 'u-shape';

  // ============== 图表引擎 ==============
  // 切换 echarts / g2 仅用于「以哪个引擎落地实现」的语义标记
  // 二者最终都按 dongDesign-chart Wiki 的视觉规范产出 Figma 图层；
  // ENGINE_PROFILES 仅记录两个引擎在「默认风格」下的细微差异，
  // 用于 UI 预览端给设计师传达"引擎默认效果"的差异提示。
  export type ChartEngine = 'echarts' | 'g2';

  export interface EngineProfile {
    id: ChartEngine;
    label: string;
    // 折线 stroke 端点（Wiki 默认 round；echarts 默认 butt，g2 默认 butt）
    lineCap: 'butt' | 'round' | 'square';
    // 折线 stroke 拐角（Wiki 默认 round；两库默认均 miter）
    lineJoin: 'miter' | 'round' | 'bevel';
    // 柱状/环形扇区圆角（Wiki 偏向 round；echarts 默认 0、g2 默认 0）
    barRadius: number;
    // markPoint hover 圆点 size（两库默认值不同）
    markPointSize: number;
    // 文档/规范出处
    specRef: string;
  }

  // 注：以下数值均以 Wiki 规范为基线，差异部分仅作"风格暗示"
  export const ENGINE_PROFILES: Record<ChartEngine, EngineProfile> = {
    echarts: {
      id: 'echarts',
      label: 'ECharts',
      lineCap: 'round',
      lineJoin: 'round',
      barRadius: 2,
      markPointSize: 8,
      specRef: '04-adaptation/echarts-adapter.md',
    },
    g2: {
      id: 'g2',
      label: 'AntV G2',
      lineCap: 'round',
      lineJoin: 'round',
      barRadius: 1,
      markPointSize: 8,
      specRef: '04-adaptation/g2-adapter.md',
    },
  };

  export function getEngineProfile(id: ChartEngine): EngineProfile {
    return ENGINE_PROFILES[id] ?? ENGINE_PROFILES.echarts;
  }

  export interface ChartOptions {
    chartType: ChartType;
    width: number;
    height: number;
    title: string;
    showTitle: boolean;
    showLegend: boolean;
    legendPosition: LegendPosition;
    legendPaging: boolean;
    showAxis: boolean;
    showGrid: boolean;
    showLabels: boolean;
    showMarkPoint: boolean;
    showConversionLine: boolean;
    showConversionLineLabel: boolean;
    palette: PaletteId;
    theme: 'default';
    engine: ChartEngine;
    dataText: string;
  }

  export interface ParsedDatum {
    category: string;
    values: Record<string, number>;
  }
}
