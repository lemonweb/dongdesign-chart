/// <reference path="./theme.ts" />
/// <reference path="./chart-data.ts" />

namespace DongChart {
  // ============================================================
  // 代码导出器：基于同一份 dongDesign-chart 规范
  //  - 输入：ChartDataset + ChartOptions（含 engine 字段）
  //  - 输出：可直接粘贴到工程里运行的 echarts option / G2 spec
  //  - 两个引擎的产物在视觉规范上完全一致：
  //      • 字号 12 / 行高 18 / fontWeight 400
  //      • 折线 strokeWidth 2.5、不显示 symbol
  //      • Y 轴 minBaseline 0、刻度 ~5 个、splitLine 虚线 [4,4]
  //      • 折线图例 shape = line(10x2)，柱状/环形 shape = rect(10x10 r2)
  //      • 环形 innerRadius = 70%
  //  - Wiki 出处：04-adaptation/echarts-adapter.md / g2-adapter.md
  // ============================================================

  export interface ExportResult {
    engine: ChartEngine;
    language: 'javascript';
    code: string;
  }

  export function exportChartCode(
    dataset: ChartDataset,
    options: ChartOptions
  ): ExportResult {
    if (options.engine === 'g2') {
      return { engine: 'g2', language: 'javascript', code: buildG2Code(dataset, options) };
    }
    return { engine: 'echarts', language: 'javascript', code: buildEChartsCode(dataset, options) };
  }

  // -------------------- ECharts --------------------

  function buildEChartsCode(ds: ChartDataset, opt: ChartOptions): string {
    const palette = getPalette(opt.palette);
    const colors = palette.colors.slice(0, Math.max(ds.series.length, ds.categories.length));
    const colorArr = colors.map((c) => `'${c}'`).join(', ');

    const titleBlock = opt.showTitle && opt.title.trim()
      ? `  title: { text: '${esc(opt.title)}', textStyle: { color: '#262626', fontSize: 14, fontWeight: 600 } },`
      : '';

    const legendBlock = opt.showLegend
      ? buildEChartsLegend(opt)
      : '  legend: { show: false },';

    const tooltipBlock = `  tooltip: { trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: '#3365F7', width: 1, type: 'solid' } } },`;

    if (opt.chartType === 'donut') {
      return [
        `// dongDesign-chart · ECharts · 环形图`,
        `// Wiki: knowledge-base/dongdesign-chart/04-adaptation/echarts-adapter.md`,
        `const option = {`,
        `  color: [${colorArr}],`,
        titleBlock,
        legendBlock,
        `  tooltip: { trigger: 'item' },`,
        `  series: [{`,
        `    type: 'pie',`,
        `    radius: ['35%', '50%'],`,
        `    avoidLabelOverlap: true,`,
        `    itemStyle: { borderColor: '#fff', borderWidth: 2 },`,
        `    label: { show: ${opt.showLabels} },`,
        `    labelLine: { show: ${opt.showLabels} },`,
        `    data: [`,
        ...ds.categories.map((cat, i) =>
          `      { name: '${esc(cat)}', value: ${ds.series[0]?.values[i] ?? 0} },`),
        `    ],`,
        `  }],`,
        `};`,
      ].filter(Boolean).join('\n');
    }

    const isLine = opt.chartType === 'line';
    const seriesCode = ds.series.map((s) => {
      if (isLine) {
        return [
          `    {`,
          `      name: '${esc(s.name)}',`,
          `      type: 'line',`,
          `      smooth: false,`,
          `      showSymbol: ${opt.showMarkPoint},`,
          `      symbol: 'circle',`,
          `      symbolSize: 8,`,
          `      lineStyle: { width: 2.5, cap: 'round', join: 'round' },`,
          `      itemStyle: { borderWidth: 2, borderColor: '#fff' },`,
          `      data: [${s.values.join(', ')}],`,
          `    },`,
        ].join('\n');
      }
      return [
        `    {`,
        `      name: '${esc(s.name)}',`,
        `      type: 'bar',`,
        `      barCategoryGap: '20%',`,
        `      itemStyle: { borderRadius: [2, 2, 0, 0] },`,
        `      data: [${s.values.join(', ')}],`,
        `    },`,
      ].join('\n');
    }).join('\n');

    return [
      `// dongDesign-chart · ECharts · ${isLine ? '折线图' : '柱状图'}`,
      `// Wiki: knowledge-base/dongdesign-chart/04-adaptation/echarts-adapter.md`,
      `const option = {`,
      `  color: [${colorArr}],`,
      titleBlock,
      legendBlock,
      tooltipBlock,
      `  grid: { left: 48, right: 24, top: ${opt.showLegend && legendIsTop(opt) ? 56 : 32}, bottom: ${opt.showLegend && legendIsBottom(opt) ? 48 : 32}, containLabel: true },`,
      `  xAxis: {`,
      `    type: 'category',`,
      `    boundaryGap: ${!isLine},`,
      `    data: [${ds.categories.map((c) => `'${esc(c)}'`).join(', ')}],`,
      `    axisLine: { show: ${opt.showAxis}, lineStyle: { color: '#D9D9D9', width: 1 } },`,
      `    axisTick: { show: false },`,
      `    axisLabel: { color: '#8C8C8C', fontSize: 12, fontWeight: 400, lineHeight: 18 },`,
      `  },`,
      `  yAxis: {`,
      `    type: 'value',`,
      `    min: 0,`,
      `    splitNumber: 4,`,
      `    axisLine: { show: false },`,
      `    axisTick: { show: false },`,
      `    splitLine: { show: ${opt.showGrid}, lineStyle: { color: '#EBEBEB', width: 1, type: 'dashed' } },`,
      `    axisLabel: { color: '#8C8C8C', fontSize: 12, fontWeight: 400, lineHeight: 18 },`,
      `  },`,
      `  series: [`,
      seriesCode,
      `  ],`,
      `};`,
    ].filter(Boolean).join('\n');
  }

  function buildEChartsLegend(opt: ChartOptions): string {
    // 图例位置 → echarts 的 left/top/right/bottom + orient
    const isVertical = opt.legendPosition === 'left-center' || opt.legendPosition === 'right-center';
    let pos = '';
    switch (opt.legendPosition) {
      case 'top-left': pos = `left: 'left', top: 'top'`; break;
      case 'top-right': pos = `right: 'right', top: 'top'`; break;
      case 'bottom-left': pos = `left: 'left', bottom: 'bottom'`; break;
      case 'bottom-right': pos = `right: 'right', bottom: 'bottom'`; break;
      case 'left-center': pos = `left: 'left', top: 'middle'`; break;
      case 'right-center': pos = `right: 'right', top: 'middle'`; break;
    }
    const icon = opt.chartType === 'line'
      ? `'image://data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'10\\' height=\\'2\\' viewBox=\\'0 0 10 2\\'><rect width=\\'10\\' height=\\'2\\' rx=\\'1\\' fill=\\'currentColor\\'/></svg>'`
      : `'roundRect'`;
    return `  legend: { show: true, ${pos}, orient: '${isVertical ? 'vertical' : 'horizontal'}', icon: ${icon}, itemWidth: 10, itemHeight: ${opt.chartType === 'line' ? 2 : 10}, itemGap: 20, textStyle: { color: '#595959', fontSize: 12 } },`;
  }

  function legendIsTop(opt: ChartOptions): boolean {
    return opt.legendPosition === 'top-left' || opt.legendPosition === 'top-right';
  }
  function legendIsBottom(opt: ChartOptions): boolean {
    return opt.legendPosition === 'bottom-left' || opt.legendPosition === 'bottom-right';
  }

  // -------------------- AntV G2 --------------------

  function buildG2Code(ds: ChartDataset, opt: ChartOptions): string {
    const palette = getPalette(opt.palette);
    const colors = palette.colors.slice(0, Math.max(ds.series.length, ds.categories.length));
    const colorArr = colors.map((c) => `'${c}'`).join(', ');

    const dataExpr = buildG2Data(ds, opt);
    const titleSnippet = opt.showTitle && opt.title.trim()
      ? `chart.title({ title: '${esc(opt.title)}', style: { titleFontSize: 14, titleFontWeight: 600, titleFill: '#262626' } });`
      : '';
    const legendSnippet = opt.showLegend ? buildG2Legend(opt) : `chart.legend(false);`;

    if (opt.chartType === 'donut') {
      return [
        `// dongDesign-chart · AntV G2 · 环形图`,
        `// Wiki: knowledge-base/dongdesign-chart/04-adaptation/g2-adapter.md`,
        `import { Chart } from '@antv/g2';`,
        ``,
        `const chart = new Chart({ container: 'container', autoFit: true });`,
        ``,
        `${titleSnippet}`,
        `${legendSnippet}`,
        ``,
        `chart`,
        `  .interval()`,
        `  .data(${dataExpr})`,
        `  .transform({ type: 'stackY' })`,
        `  .coordinate({ type: 'theta', innerRadius: 0.7, outerRadius: 1 })`,
        `  .encode('y', 'value')`,
        `  .encode('color', 'name')`,
        `  .scale('color', { range: [${colorArr}] })`,
        `  .style('stroke', '#fff')`,
        `  .style('lineWidth', 2)`,
        `  .label({ text: 'name', style: { fontSize: 12 }, position: 'outside', visible: ${opt.showLabels} });`,
        ``,
        `chart.render();`,
      ].filter(Boolean).join('\n');
    }

    const isLine = opt.chartType === 'line';
    const markCalls = isLine
      ? [
          `chart.line()`,
          `  .data(${dataExpr})`,
          `  .encode('x', 'category')`,
          `  .encode('y', 'value')`,
          `  .encode('color', 'series')`,
          `  .scale('color', { range: [${colorArr}] })`,
          `  .style('strokeWidth', 2.5)`,
          `  .style('lineCap', 'round')`,
          `  .style('lineJoin', 'round');`,
          opt.showMarkPoint
            ? `chart.point()\n  .data(${dataExpr})\n  .encode('x', 'category')\n  .encode('y', 'value')\n  .encode('color', 'series')\n  .scale('color', { range: [${colorArr}] })\n  .style('lineWidth', 2)\n  .style('stroke', '#fff')\n  .tooltip(false);`
            : '',
        ].filter(Boolean).join('\n')
      : [
          `chart.interval()`,
          `  .data(${dataExpr})`,
          `  .encode('x', 'category')`,
          `  .encode('y', 'value')`,
          `  .encode('color', 'series')`,
          `  .scale('color', { range: [${colorArr}] })`,
          `  .transform({ type: 'dodgeX' })`,
          `  .style('radiusTopLeft', 2)`,
          `  .style('radiusTopRight', 2);`,
        ].join('\n');

    return [
      `// dongDesign-chart · AntV G2 · ${isLine ? '折线图' : '柱状图'}`,
      `// Wiki: knowledge-base/dongdesign-chart/04-adaptation/g2-adapter.md`,
      `import { Chart } from '@antv/g2';`,
      ``,
      `const chart = new Chart({ container: 'container', autoFit: true });`,
      ``,
      `${titleSnippet}`,
      `${legendSnippet}`,
      ``,
      `chart.axis('x', {`,
      `  tick: false,`,
      `  line: { style: { stroke: '#D9D9D9', lineWidth: 1, visible: ${opt.showAxis} } },`,
      `  label: { style: { fill: '#8C8C8C', fontSize: 12, fontWeight: 400 } },`,
      `});`,
      `chart.axis('y', {`,
      `  line: false,`,
      `  tick: false,`,
      `  grid: { style: { stroke: '#EBEBEB', lineWidth: 1, lineDash: [4, 4], visible: ${opt.showGrid} } },`,
      `  label: { style: { fill: '#8C8C8C', fontSize: 12, fontWeight: 400 } },`,
      `});`,
      `chart.scale('y', { domainMin: 0, tickCount: 5, nice: true });`,
      ``,
      markCalls,
      ``,
      `chart.render();`,
    ].filter(Boolean).join('\n');
  }

  function buildG2Data(ds: ChartDataset, opt: ChartOptions): string {
    if (opt.chartType === 'donut') {
      const items: string[] = [];
      ds.categories.forEach((cat, i) => {
        items.push(`  { name: '${esc(cat)}', value: ${ds.series[0]?.values[i] ?? 0} }`);
      });
      return `[\n${items.join(',\n')}\n]`;
    }
    const items: string[] = [];
    ds.series.forEach((s) => {
      ds.categories.forEach((cat, i) => {
        items.push(`  { category: '${esc(cat)}', value: ${s.values[i] ?? 0}, series: '${esc(s.name)}' }`);
      });
    });
    return `[\n${items.join(',\n')}\n]`;
  }

  function buildG2Legend(opt: ChartOptions): string {
    const isVertical = opt.legendPosition === 'left-center' || opt.legendPosition === 'right-center';
    const map: Record<LegendPosition, string> = {
      'top-left': 'top-left',
      'top-right': 'top-right',
      'bottom-left': 'bottom-left',
      'bottom-right': 'bottom-right',
      'left-center': 'left',
      'right-center': 'right',
    };
    const itemMarker = opt.chartType === 'line' ? `'line'` : `'square'`;
    return `chart.legend('color', { position: '${map[opt.legendPosition]}', layout: { justifyContent: 'flex-start' }, itemMarker: ${itemMarker}, itemMarkerSize: ${opt.chartType === 'line' ? 10 : 10}, labelSpacing: 5, itemSpacing: 20 });`;
  }

  function esc(s: string): string {
    return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
}