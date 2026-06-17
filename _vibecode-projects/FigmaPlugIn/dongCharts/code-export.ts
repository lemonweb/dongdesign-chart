/// <reference path="./theme.ts" />
/// <reference path="./chart-data.ts" />

namespace DongChart {
  // ============================================================
  // 代码导出器：基于同一份 dongDesign-chart 规范
  //  - 输入：ChartDataset + ChartOptions（含 engine 字段）
  //  - 输出：可直接粘贴到工程里运行的 echarts option / G2 spec
  //  - 两个引擎的产物在视觉规范上完全一致：
  //      • 字号 12 / 行高 18 / fontWeight 400
  //      • 折线 strokeWidth 2、不显示 symbol
  //      • 维度轴开启 boundaryGap 且显示轴线；指标轴不显示轴线
  //      • 指标轴 minBaseline 0、splitNumber 4（约 5 个值）、splitLine 虚线 [4,4]
  //      • 指标轴标签右对齐，距绘图区 8px；维度轴标签距轴线 10px
  //      • 折线/面积图例 shape = line(10x2)，柱状/饼环 shape = rect(10x10 r2)
  //      • 环形 innerRadius = 70%，饼图 innerRadius = 0
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
      ? buildEChartsLegend(ds, opt)
      : '  legend: { show: false },';

    const tooltipBlock = `  tooltip: { trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: '#3365F7', width: 1, type: 'solid' } } },`;

    if (isPieLikeChart(opt.chartType)) {
      const isDonut = opt.chartType === 'donut';
      return [
        `// dongDesign-chart · ECharts · ${chartTypeZh(opt.chartType)}`,
        `// Wiki: knowledge-base/dongdesign-chart/04-adaptation/echarts-adapter.md`,
        `const option = {`,
        `  color: [${colorArr}],`,
        titleBlock,
        legendBlock,
        `  tooltip: { trigger: 'item' },`,
        `  series: [{`,
        `    type: 'pie',`,
        `    radius: ${isDonut ? `['58%', '76%']` : `'76%'`},`,
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

    if (isRadarChart(opt.chartType)) {
      const maxValue = Math.max(...ds.series.flatMap((series) => series.values), 1);
      return [
        `// dongDesign-chart · ECharts · ${chartTypeZh(opt.chartType)}`,
        `// Wiki: knowledge-base/dongdesign-chart/02-chart-type/basic/radar-chart.md`,
        `const option = {`,
        `  color: [${colorArr}],`,
        titleBlock,
        legendBlock,
        `  tooltip: { trigger: 'item' },`,
        `  radar: {`,
        `    radius: '66%',`,
        `    splitNumber: 4,`,
        `    axisName: { color: '#8C8C8C', fontSize: 12, fontWeight: 400 },`,
        `    axisLine: { lineStyle: { color: '#EBEBEB', width: 1 } },`,
        `    splitLine: { lineStyle: { color: '#EBEBEB', width: 1, type: 'dashed' } },`,
        `    splitArea: { show: true, areaStyle: { color: ['rgba(51,101,247,0.04)', 'rgba(255,255,255,0)'] } },`,
        `    indicator: [${ds.categories.map((cat) => `{ name: '${esc(cat)}', max: ${maxValue} }`).join(', ')}],`,
        `  },`,
        `  series: [{`,
        `    type: 'radar',`,
        `    symbol: 'circle',`,
        `    symbolSize: 8,`,
        `    lineStyle: { width: 2 },`,
        `    areaStyle: { opacity: 0.1 },`,
        `    itemStyle: { borderColor: '#fff', borderWidth: 2 },`,
        `    label: { show: ${opt.showLabels}, color: '#262626', fontSize: 12 },`,
        `    data: [`,
        ...ds.series.map((series) => `      { name: '${esc(series.name)}', value: [${ds.categories.map((_, i) => series.values[i] ?? 0).join(', ')}] },`),
        `    ],`,
        `  }],`,
        `};`,
      ].filter(Boolean).join('\n');
    }

    if (isScatterLikeChart(opt.chartType)) {
      const points = getScatterExportData(ds, opt.chartType);
      const sizes = points.map((point) => point.size);
      const minSize = Math.min(...sizes, 0);
      const maxSize = Math.max(...sizes, 1);
      const diameterRange = opt.chartType === 'bubble' ? '[12, 48]' : '[8, 8]';
      const seriesCode = opt.chartType === 'scatter'
        ? ds.series.map((series, seriesIndex) => {
          const seriesPoints = points.filter((point) => point.seriesIndex === seriesIndex);
          return [
            `    {`,
            `      name: '${esc(series.name)}',`,
            `      type: 'scatter',`,
            `      universalTransition: { enabled: true, divideShape: 'clone' },`,
            `      animationTypeUpdate: 'transition',`,
            `      symbol: 'circle',`,
            `      symbolSize: 8,`,
            `      itemStyle: { color: '${series.color}', opacity: 1, borderWidth: 0 },`,
            `      emphasis: { itemStyle: { borderWidth: 0, opacity: 1 } },`,
            `      label: { show: ${opt.showLabels}, position: 'top', color: '#262626', fontSize: 12, fontWeight: 400, textBorderColor: '#fff', textBorderWidth: 2, formatter: (params) => params.value[3] || '' },`,
            `      labelLayout: { hideOverlap: true },`,
            `      data: [`,
            ...seriesPoints.map((point) => `        { id: 'scatter-${seriesIndex}-${point.categoryIndex}', value: [${point.x}, ${point.y}, ${point.size}, '${esc(point.name)}', '${esc(point.seriesName)}'] },`),
            `      ],`,
            `    },`,
          ].join('\n');
        }).join('\n')
        : Array.from(new Map(points.map((point) => [point.seriesIndex, point.seriesName])).entries()).map(([seriesIndex, seriesName]) => {
          const seriesPoints = points.filter((point) => point.seriesIndex === seriesIndex);
          return [
            `    {`,
            `      name: '${esc(seriesName)}',`,
            `      type: 'scatter',`,
            `      universalTransition: { enabled: true, divideShape: 'clone' },`,
            `      animationTypeUpdate: 'transition',`,
            `      symbol: 'circle',`,
            `      symbolSize: (value) => scaleSize(value[2]),`,
            `      itemStyle: { color: '${colors[seriesIndex % colors.length]}', opacity: 0.62, borderWidth: 0 },`,
            `      emphasis: { itemStyle: { borderWidth: 0, opacity: 1 } },`,
            `      label: { show: ${opt.showLabels}, position: 'top', color: '#262626', fontSize: 12, fontWeight: 400, textBorderColor: '#fff', textBorderWidth: 2, formatter: (params) => params.value[3] || '' },`,
            `      labelLayout: { hideOverlap: true },`,
            `      data: [`,
            ...seriesPoints.map((point) => `        [${point.x}, ${point.y}, ${point.size}, '${esc(point.name)}', '${esc(point.seriesName)}'],`),
            `      ],`,
            `    },`,
          ].join('\n');
        }).join('\n');
      return [
        `// dongDesign-chart · ECharts · ${chartTypeZh(opt.chartType)}`,
        `// Wiki: knowledge-base/dongdesign-chart/02-chart-type/statistical/${opt.chartType === 'bubble' ? 'bubble' : 'scatter'}.md`,
        `const data = [`,
        ...points.map((point) => `  [${point.x}, ${point.y}, ${point.size}, '${esc(point.name)}', '${esc(point.seriesName)}'],`),
        `];`,
        `const sizeDomain = { min: ${minSize}, max: ${maxSize} };`,
        `// ECharts symbolSize 接收直径；这里对应气泡半径 6-24px。`,
        `const diameterRange = ${diameterRange};`,
        `const scaleSize = (size) => {`,
        `  if (diameterRange[0] === diameterRange[1]) return diameterRange[0];`,
        `  const ratio = (size - sizeDomain.min) / (sizeDomain.max - sizeDomain.min || 1);`,
        `  return diameterRange[0] + Math.sqrt(Math.max(0, ratio)) * (diameterRange[1] - diameterRange[0]);`,
        `};`,
        `const option = {`,
        `  color: [${colorArr}],`,
        titleBlock,
        opt.chartType === 'scatter' && opt.showLegend && ds.series.length > 1
          ? buildEChartsLegend(ds, opt)
          : `  legend: { show: false },`,
        `  tooltip: { trigger: 'item' },`,
        `  grid: { left: 50, right: ${opt.chartType === 'bubble' ? 28 : 14}, top: ${opt.showTitle ? 38 : 18}, bottom: 28, containLabel: false },`,
        `  xAxis: { type: 'value', axisLine: { show: ${opt.showAxis}, lineStyle: { color: '#D9D9D9', width: 1 } }, axisTick: { show: false }, axisLabel: { show: ${opt.showAxis}, color: '#8C8C8C', fontSize: 12, fontWeight: 400, margin: 10 }, splitLine: { show: false } },`,
        `  yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: ${opt.showAxis}, color: '#8C8C8C', fontSize: 12, fontWeight: 400, margin: 10, align: 'right' }, splitLine: { show: ${opt.showGrid}, lineStyle: { color: '#EBEBEB', width: 1, type: 'dashed' } } },`,
        `  series: [`,
        seriesCode,
        `  ],`,
        `};`,
      ].filter(Boolean).join('\n');
    }

    if (isFunnelLikeChart(opt.chartType)) {
      return [
        `// dongDesign-chart · ECharts · ${chartTypeZh(opt.chartType)}`,
        `// Wiki: knowledge-base/dongdesign-chart/02-chart-type/basic/funnel-chart.md`,
        `const option = {`,
        `  color: ['#3365F7', '#4881FC', '#6F97F9', '#84B1FA', '#A8C8FC', '#CBDEFD'],`,
        titleBlock,
        `  legend: { show: false },`,
        `  tooltip: { trigger: 'item' },`,
        `  series: [{`,
        `    type: 'funnel',`,
        `    sort: 'none',`,
        `    orient: 'vertical',`,
        `    funnelAlign: 'center',`,
        `    left: '${opt.chartType === 'convert-funnel' ? '16%' : '12%'}',`,
        `    top: ${opt.showTitle ? 42 : 18},`,
        `    width: '${opt.chartType === 'convert-funnel' ? '68%' : '76%'}',`,
        `    height: '${opt.showTitle ? '76%' : '82%'}',`,
        `    minSize: '18%',`,
        `    maxSize: '100%',`,
        `    gap: ${opt.chartType === 'convert-funnel' ? 6 : 2},`,
        `    itemStyle: { borderColor: '#fff', borderWidth: 1 },`,
        `    label: { show: ${opt.showLabels}, position: 'inside', color: '#fff', fontSize: 12, fontWeight: 600, formatter: (params) => \`\${params.name}\\n\${params.value}\` },`,
        `    data: [`,
        ...ds.categories.map((cat, i) => `      { name: '${esc(cat)}', value: ${ds.series[0]?.values[i] ?? 0} },`),
        `    ],`,
        `  }],`,
        `};`,
      ].filter(Boolean).join('\n');
    }

    const lineLike = isLineLikeChart(opt.chartType);
    const areaLike = isAreaChart(opt.chartType);
    const stacked = isStackedChart(opt.chartType);
    const seriesCode = ds.series.map((s) => {
      if (lineLike) {
        return [
          `    {`,
          `      name: '${esc(s.name)}',`,
          `      type: 'line',`,
          stacked ? `      stack: 'total',` : '',
          `      smooth: false,`,
          `      showSymbol: ${opt.showMarkPoint},`,
          `      symbol: 'circle',`,
          `      symbolSize: 8,`,
          `      lineStyle: { width: 2, cap: 'round', join: 'round' },`,
          areaLike ? `      areaStyle: { opacity: ${THEME.chart.areaOpacity} },` : '',
          `      itemStyle: { borderWidth: 2, borderColor: '#fff' },`,
          `      data: [${s.values.join(', ')}],`,
          `    },`,
        ].filter(Boolean).join('\n');
      }
      return [
        `    {`,
        `      name: '${esc(s.name)}',`,
        `      type: 'bar',`,
        stacked ? `      stack: 'total',` : '',
        `      barCategoryGap: '28%',`,
        `      barMinWidth: 2,`,
        `      barMaxWidth: 40,`,
        `      itemStyle: { borderRadius: [2, 2, 0, 0] },`,
        `      data: [${s.values.join(', ')}],`,
        `    },`,
      ].join('\n');
    }).join('\n');

    return [
      `// dongDesign-chart · ECharts · ${chartTypeZh(opt.chartType)}`,
      `// Wiki: knowledge-base/dongdesign-chart/04-adaptation/echarts-adapter.md`,
      `const option = {`,
      `  color: [${colorArr}],`,
      titleBlock,
      legendBlock,
      tooltipBlock,
      `  grid: { left: ${opt.showLegend && legendIsLeft(opt) ? 94 : 0}, right: ${opt.showLegend && legendIsRight(opt) ? 84 : 0}, top: ${opt.showTitle ? (opt.showLegend && legendIsTop(opt) ? 62 : 38) : (opt.showLegend && legendIsTop(opt) ? 42 : 18)}, bottom: ${opt.showLegend && legendIsBottom(opt) ? 52 : 34}, containLabel: true },`,
      `  xAxis: {`,
      `    type: 'category',`,
      `    boundaryGap: ${THEME.chart.categoryBoundaryGap},`,
      `    data: [${ds.categories.map((c) => `'${esc(c)}'`).join(', ')}],`,
      `    axisLine: { show: ${opt.showAxis}, lineStyle: { color: '#D9D9D9', width: 1 } },`,
      `    axisTick: { show: false },`,
      `    axisLabel: { show: ${opt.showAxis}, color: '#8C8C8C', fontSize: 12, fontWeight: 400, lineHeight: 18, margin: 10 },`,
      `  },`,
      `  yAxis: {`,
      `    type: 'value',`,
      `    min: 0,`,
      `    splitNumber: 4,`,
      `    axisLine: { show: false },`,
      `    axisTick: { show: false },`,
      `    splitLine: { show: ${opt.showGrid}, lineStyle: { color: '#EBEBEB', width: 1, type: 'dashed' } },`,
      `    axisLabel: { show: ${opt.showAxis}, color: '#8C8C8C', fontSize: 12, fontWeight: 400, lineHeight: 18, margin: 8, align: 'right' },`,
      `  },`,
      `  series: [`,
      seriesCode,
      `  ],`,
      `};`,
    ].filter(Boolean).join('\n');
  }

  function buildEChartsLegend(ds: ChartDataset, opt: ChartOptions): string {
    // 图例位置 → echarts 的 left/top/right/bottom + orient
    const isVertical = legendIsVertical(opt);
    let pos = '';
    switch (opt.legendPosition) {
      case 'top-left': pos = `left: 'left', top: 'top'`; break;
      case 'top-center': pos = `left: 'center', top: 'top'`; break;
      case 'top-right': pos = `right: 'right', top: 'top'`; break;
      case 'bottom-left': pos = `left: 'left', bottom: 'bottom'`; break;
      case 'bottom-center': pos = `left: 'center', bottom: 'bottom'`; break;
      case 'bottom-right': pos = `right: 'right', bottom: 'bottom'`; break;
      case 'left-center': pos = `left: 'left', top: 'middle'`; break;
      case 'right-center': pos = `right: 'right', top: 'middle'`; break;
    }
    const data = buildEChartsLegendData(ds, opt);
    return `  legend: { show: true, type: '${opt.legendPaging ? 'scroll' : 'plain'}', ${pos}, orient: '${isVertical ? 'vertical' : 'horizontal'}', data: [${data}], itemWidth: 10, itemHeight: 10, itemGap: 20, textStyle: { color: '#595959', fontSize: 12 }, inactiveColor: '#D9D9D9' },`;
  }

  function buildEChartsLegendData(ds: ChartDataset, opt: ChartOptions): string {
    const palette = getPalette(opt.palette);
    const shape = (isLineLikeChart(opt.chartType) || isRadarChart(opt.chartType)) ? 'line' : (opt.chartType === 'scatter' ? 'dot' : 'rect');
    const items = isPieLikeChart(opt.chartType)
      ? ds.categories.map((name, index) => ({ name, color: palette.colors[index % palette.colors.length], shape: 'rect' }))
      : opt.chartType === 'scatter'
        ? ds.series.map((series) => ({ name: series.name, color: series.color, shape: 'dot' }))
        : ds.series.map((series) => ({ name: series.name, color: series.color, shape }));
    return items.map((item) => `{ name: '${esc(item.name)}', icon: '${legendIconUri(item.color, item.shape)}' }`).join(', ');
  }

  function legendIconUri(color: string, shape: string): string {
    const svg = shape === 'line'
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="4" width="10" height="2" rx="1" fill="${color}"/></svg>`
      : shape === 'dot'
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="${color}"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="0" width="10" height="10" rx="2" fill="${color}"/></svg>`;
    return `image://data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  function legendIsTop(opt: ChartOptions): boolean {
    return opt.legendPosition === 'top-left'
      || opt.legendPosition === 'top-center'
      || opt.legendPosition === 'top-right';
  }
  function legendIsBottom(opt: ChartOptions): boolean {
    return opt.legendPosition === 'bottom-center';
  }

  function legendIsLeft(opt: ChartOptions): boolean {
    return opt.legendPosition === 'left-center' || opt.legendPosition === 'bottom-left';
  }

  function legendIsRight(opt: ChartOptions): boolean {
    return opt.legendPosition === 'right-center' || opt.legendPosition === 'bottom-right';
  }

  function legendIsVertical(opt: ChartOptions): boolean {
    return opt.legendPosition === 'left-center'
      || opt.legendPosition === 'right-center'
      || opt.legendPosition === 'bottom-left'
      || opt.legendPosition === 'bottom-right';
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

    if (isPieLikeChart(opt.chartType)) {
      return [
        `// dongDesign-chart · AntV G2 · ${chartTypeZh(opt.chartType)}`,
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
        `  .coordinate({ type: 'theta', innerRadius: ${opt.chartType === 'donut' ? 0.7 : 0}, outerRadius: 1 })`,
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

    if (isRadarChart(opt.chartType)) {
      return [
        `// dongDesign-chart · AntV G2 · ${chartTypeZh(opt.chartType)}`,
        `// Wiki: knowledge-base/dongdesign-chart/02-chart-type/basic/radar-chart.md`,
        `import { Chart } from '@antv/g2';`,
        ``,
        `const chart = new Chart({ container: 'container', autoFit: true });`,
        ``,
        `${titleSnippet}`,
        `${legendSnippet}`,
        `chart.interaction('tooltip', true);`,
        ``,
        `chart.coordinate({ type: 'polar' });`,
        `chart.area().data(${dataExpr}).encode('x', 'category').encode('y', 'value').encode('color', 'series').scale('color', { range: [${colorArr}] }).style('fillOpacity', 0.1);`,
        `chart.line().data(${dataExpr}).encode('x', 'category').encode('y', 'value').encode('color', 'series').scale('color', { range: [${colorArr}] }).style('strokeWidth', 2);`,
        ``,
        `chart.render();`,
      ].filter(Boolean).join('\n');
    }

    if (isScatterLikeChart(opt.chartType)) {
      return [
        `// dongDesign-chart · AntV G2 · ${chartTypeZh(opt.chartType)}`,
        `// Wiki: knowledge-base/dongdesign-chart/02-chart-type/statistical/${opt.chartType === 'bubble' ? 'bubble' : 'scatter'}.md`,
        `import { Chart } from '@antv/g2';`,
        ``,
        `const chart = new Chart({ container: 'container', autoFit: true });`,
        ``,
        `${titleSnippet}`,
        `chart.legend(false);`,
        ``,
        `chart.point()`,
        `  .data(${dataExpr})`,
        `  .encode('x', 'x')`,
        `  .encode('y', 'y')`,
        opt.chartType === 'bubble' ? `  .encode('size', 'size')` : '',
        opt.chartType === 'scatter' && ds.series.length > 1 ? `  .encode('color', 'series')` : '',
        opt.chartType === 'scatter' && ds.series.length > 1 ? `  .scale('color', { range: [${colorArr}] })` : `  .style('fill', '${colors[0]}')`,
        opt.chartType === 'bubble' ? `  .scale('size', { range: [6, 24] })` : `  .style('r', 4)`,
        `  .style('fillOpacity', ${opt.chartType === 'bubble' ? 0.62 : 1})`,
        `  .style('lineWidth', 0)`,
        opt.showLabels ? `  .label({ text: 'name', position: 'top', style: { fontSize: 12, fill: '#262626', stroke: '#fff', lineWidth: 2 } });` : `  .label(false);`,
        ``,
        `chart.render();`,
      ].filter(Boolean).join('\n');
    }

    if (isFunnelLikeChart(opt.chartType)) {
      return [
        `// dongDesign-chart · AntV G2 · ${chartTypeZh(opt.chartType)}`,
        `// Wiki: knowledge-base/dongdesign-chart/02-chart-type/basic/funnel-chart.md`,
        `import { Chart } from '@antv/g2';`,
        ``,
        `const chart = new Chart({ container: 'container', autoFit: true });`,
        ``,
        `${titleSnippet}`,
        `chart.legend(false);`,
        ``,
        `chart.interval()`,
        `  .data(${dataExpr})`,
        `  .encode('x', 'name')`,
        `  .encode('y', 'value')`,
        `  .encode('color', 'name')`,
        `  .scale('color', { range: ['#3365F7', '#4881FC', '#6F97F9', '#84B1FA', '#A8C8FC', '#CBDEFD'] })`,
        `  .coordinate({ transform: [{ type: 'transpose' }] })`,
        `  .style('stroke', '#fff')`,
        `  .style('lineWidth', 1)`,
        opt.showLabels ? `  .label({ text: 'name', position: 'inside', style: { fontSize: 12, fill: '#fff', fontWeight: 600 } });` : `  .label(false);`,
        ``,
        `chart.render();`,
      ].filter(Boolean).join('\n');
    }

    const lineLike = isLineLikeChart(opt.chartType);
    const areaLike = isAreaChart(opt.chartType);
    const stacked = isStackedChart(opt.chartType);
    const markCalls = lineLike
      ? [
          areaLike
            ? `chart.area()\n  .data(${dataExpr})\n  .encode('x', 'category')\n  .encode('y', 'value')\n  .encode('color', 'series')\n  .scale('color', { range: [${colorArr}] })\n  ${stacked ? `.transform({ type: 'stackY' })\n  ` : ''}.style('fillOpacity', ${THEME.chart.areaOpacity});`
            : '',
          `chart.line()`,
          `  .data(${dataExpr})`,
          `  .encode('x', 'category')`,
          `  .encode('y', 'value')`,
          `  .encode('color', 'series')`,
          `  .scale('color', { range: [${colorArr}] })`,
          stacked ? `  .transform({ type: 'stackY' })` : '',
          `  .style('strokeWidth', 2)`,
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
          `  .transform({ type: '${stacked ? 'stackY' : 'dodgeX'}' })`,
          `  .style('radiusTopLeft', 2)`,
          `  .style('radiusTopRight', 2);`,
        ].join('\n');

    return [
      `// dongDesign-chart · AntV G2 · ${chartTypeZh(opt.chartType)}`,
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
    if (isPieLikeChart(opt.chartType) || isFunnelLikeChart(opt.chartType)) {
      const items: string[] = [];
      ds.categories.forEach((cat, i) => {
        items.push(`  { name: '${esc(cat)}', value: ${ds.series[0]?.values[i] ?? 0} }`);
      });
      return `[\n${items.join(',\n')}\n]`;
    }
    if (isScatterLikeChart(opt.chartType)) {
      const items = getScatterExportData(ds, opt.chartType).map((point) =>
        `  { name: '${esc(point.name)}', series: '${esc(point.seriesName)}', x: ${point.x}, y: ${point.y}, size: ${point.size} }`);
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
    const map: Record<LegendPosition, string> = {
      'top-left': 'top-left',
      'top-center': 'top',
      'top-right': 'top-right',
      'bottom-left': 'bottom-left',
      'bottom-center': 'bottom',
      'bottom-right': 'bottom-right',
      'left-center': 'left',
      'right-center': 'right',
    };
    const isVertical = legendIsVertical(opt);
    const itemMarker = isLineLikeChart(opt.chartType) || isRadarChart(opt.chartType)
      ? `'line'`
      : (opt.chartType === 'scatter' ? `'circle'` : `'square'`);
    return `chart.legend('color', { position: '${map[opt.legendPosition]}', layout: { justifyContent: 'flex-start', flexDirection: '${isVertical ? 'column' : 'row'}' }, itemMarker: ${itemMarker}, itemMarkerSize: 10, labelSpacing: 5, itemSpacing: 20${opt.legendPaging ? `, nav: true` : ''} });`;
  }

  function chartTypeZh(type: ChartType): string {
    if (type === 'line') return '折线图';
    if (type === 'area') return '面积图';
    if (type === 'stacked-area') return '堆叠面积图';
    if (type === 'bar') return '柱状图';
    if (type === 'stacked-bar') return '堆叠柱状图';
    if (type === 'pie') return '饼图';
    if (type === 'radar') return '雷达图';
    if (type === 'scatter') return '散点图';
    if (type === 'bubble') return '气泡图';
    if (type === 'funnel') return '漏斗图';
    if (type === 'convert-funnel') return '转化漏斗图';
    return '环形图';
  }

  function getScatterExportData(ds: ChartDataset, chartType: ChartType): Array<{ name: string; seriesName: string; seriesIndex: number; categoryIndex: number; x: number; y: number; size: number }> {
    if (chartType === 'scatter') {
      return ds.series.flatMap((series, seriesIndex) => ds.categories.map((name, categoryIndex) => ({
        name,
        seriesName: series.name,
        seriesIndex,
        categoryIndex,
        x: categoryIndex + 1,
        y: series.values[categoryIndex] ?? 0,
        size: series.values[categoryIndex] ?? 1,
      })));
    }

    const groupCount = Math.max(1, Math.floor(ds.series.length / 3));
    return Array.from({ length: groupCount }, (_, groupIndex) => {
      const offset = groupIndex * 3;
      const xSeries = ds.series[offset];
      const ySeries = ds.series[offset + 1];
      const sizeSeries = ds.series[offset + 2];
      if (!xSeries || !ySeries) return [];
      const rawName = xSeries.name.replace(/\s*X值$/, '').trim();
      const seriesName = rawName || (groupCount === 1 ? '气泡图' : `类型 ${groupIndex + 1}`);
      return ds.categories.map((name, categoryIndex) => ({
        name,
        seriesName,
        seriesIndex: groupIndex,
        categoryIndex,
        x: xSeries.values[categoryIndex] ?? 0,
        y: ySeries.values[categoryIndex] ?? 0,
        size: sizeSeries?.values[categoryIndex] ?? ySeries.values[categoryIndex] ?? 1,
      }));
    }).flat();
  }

  function esc(s: string): string {
    return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
}
