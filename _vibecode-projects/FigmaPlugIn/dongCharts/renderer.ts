/// <reference path="./theme.ts" />
/// <reference path="./chart-data.ts" />

namespace DongChart {
  type FontLoader = (family: string, style: string) => Promise<void>;

  const FONT_FAMILY = 'Inter';
  const REGULAR: FontName = { family: FONT_FAMILY, style: 'Regular' };
  const SEMIBOLD: FontName = { family: FONT_FAMILY, style: 'Semi Bold' };

  function hexToRgb(hex: string): RGB {
    const normalized = hex.replace('#', '');
    const value = normalized.length === 3
      ? normalized.split('').map((char) => char + char).join('')
      : normalized;
    const num = parseInt(value, 16);
    return {
      r: ((num >> 16) & 0xff) / 255,
      g: ((num >> 8) & 0xff) / 255,
      b: (num & 0xff) / 255,
    };
  }

  function solidFill(hex: string, opacity = 1): Paint {
    return { type: 'SOLID', color: hexToRgb(hex), opacity };
  }

  function setSolidFill(node: GeometryMixin, hex: string, opacity = 1): void {
    node.fills = [solidFill(hex, opacity)];
  }

  function setSolidStroke(node: MinimalStrokesMixin, hex: string, weight = 1, opacity = 1): void {
    node.strokes = [solidFill(hex, opacity)];
    (node as unknown as { strokeWeight: number }).strokeWeight = weight;
  }

  function setTextStroke(node: TextNode, hex: string, weight = 2, opacity = 1): void {
    (node as unknown as MinimalStrokesMixin).strokes = [solidFill(hex, opacity)];
    (node as unknown as { strokeWeight: number; strokeAlign?: 'CENTER' }).strokeWeight = weight;
    (node as unknown as { strokeAlign?: 'CENTER' }).strokeAlign = 'CENTER';
  }

  async function createText(
    characters: string,
    options: {
      fontSize?: number;
      bold?: boolean;
      color?: string;
      ensureFont: FontLoader;
      lineHeight?: number;
    },
  ): Promise<TextNode> {
    const font = options.bold ? SEMIBOLD : REGULAR;
    await options.ensureFont(font.family, font.style);
    const text = figma.createText();
    text.fontName = font;
    text.characters = characters;
    text.fontSize = options.fontSize ?? THEME.typography.bodySmall.size;
    if (options.lineHeight) {
      text.lineHeight = { value: options.lineHeight, unit: 'PIXELS' };
    }
    setSolidFill(text, options.color ?? THEME.colors.title.value);
    return text;
  }

  function niceDomain(values: number[]): { min: number; max: number; step: number; ticks: number[] } {
    const flat = values.filter((value) => Number.isFinite(value));
    const rawMin = Math.min(0, ...flat);
    const rawMax = Math.max(...flat, 1);
    const range = rawMax - rawMin || 1;
    const roughStep = range / 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const candidates = [1, 2, 2.5, 5, 10];
    const step = candidates
      .map((factor) => factor * magnitude)
      .find((value) => value >= roughStep) ?? magnitude;
    const min = Math.floor(rawMin / step) * step;
    const max = Math.ceil(rawMax / step) * step;
    const ticks: number[] = [];
    for (let value = min; value <= max + 1e-6; value += step) {
      ticks.push(Number(value.toFixed(6)));
    }
    return { min, max, step, ticks };
  }

  export async function renderChart(
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
  ): Promise<FrameNode> {
    validateDatasetForChart(dataset, options.chartType);
    const width = clamp(options.width, THEME.chart.minWidth, THEME.chart.maxWidth);
    const height = clamp(options.height, THEME.chart.minHeight, THEME.chart.maxHeight);

    // 容器使用绝对布局以便按 legendPosition 自由摆放
    const frame = figma.createFrame();
    frame.name = `Chart / ${chartLabel(options.chartType)} / ${getEngineProfile(options.engine).label}`;
    frame.resize(width, height);
    frame.cornerRadius = 8;
    frame.clipsContent = false;
    setSolidFill(frame, THEME.colors.card.value);

    const pad = THEME.spacing.framePadding;
    const gap = THEME.spacing.sectionGap;
    const innerLeft = pad;
    const innerTop = pad;
    const innerRight = width - pad;
    const innerBottom = height - pad;
    const innerWidth = innerRight - innerLeft;

    // 1) 标题
    const titleText = (options.title || '').trim();
    let titleNode: TextNode | null = null;
    if (options.showTitle && titleText) {
      titleNode = await createText(titleText, {
        fontSize: THEME.typography.title.size,
        lineHeight: THEME.typography.title.lineHeight,
        bold: true,
        color: THEME.colors.title.value,
        ensureFont,
      });
      titleNode.name = 'Title';
      titleNode.resize(innerWidth, titleNode.height);
      titleNode.x = innerLeft;
      titleNode.y = innerTop;
      frame.appendChild(titleNode);
    }
    const titleBottom = titleNode ? titleNode.y + titleNode.height + gap : innerTop;

    // 2) 图例（按位置摆放）
    let legend: FrameNode | null = null;
    if (options.showLegend && getLegendItems(dataset, options).length > 0) {
      legend = await renderLegend(dataset, options, ensureFont);
    }

    // 3) 计算绘图区与图例的位置
    let plotX = innerLeft;
    let plotY = titleBottom;
    let plotWidth = innerWidth;
    let plotHeight = innerBottom - titleBottom;

    if (legend) {
      const pos = options.legendPosition;
      const isTop = pos === 'top-left' || pos === 'top-center' || pos === 'top-right';
      const isBottomCenter = pos === 'bottom-center';

      if (isTop || isBottomCenter) {
        // 顶部 / 下中图例：占据一行，绘图区扣减相应高度
        const legendH = legend.height;
        if (isTop) {
          legend.y = titleBottom;
          plotY = titleBottom + legendH + gap;
        } else {
          legend.y = innerBottom - legendH;
          plotY = titleBottom;
        }
        plotHeight = innerBottom - plotY - (isBottomCenter ? legendH + gap : 0);
        // 水平对齐
        legend.x = alignLegendX(pos, innerLeft, innerRight, legend.width);
      } else {
        // 左中 / 右中 / 左下 / 右下图例：竖排并占据一列，绘图区扣减相应宽度
        const legendW = legend.width;
        if (pos === 'left-center' || pos === 'bottom-left') {
          legend.x = innerLeft;
          plotX = innerLeft + legendW + gap;
        } else {
          legend.x = innerRight - legendW;
        }
        plotWidth = innerWidth - legendW - gap;
        // 垂直居中相对绘图区
        plotY = titleBottom;
        plotHeight = innerBottom - plotY;
        legend.y = pos.startsWith('bottom')
          ? innerBottom - legend.height
          : plotY + (plotHeight - legend.height) / 2;
      }

      frame.appendChild(legend);
    }

    plotWidth = Math.max(80, plotWidth);
    plotHeight = Math.max(80, plotHeight);

    const plotFrame = figma.createFrame();
    plotFrame.name = 'Plot Area';
    plotFrame.resize(plotWidth, plotHeight);
    plotFrame.fills = [];
    plotFrame.clipsContent = false;
    plotFrame.x = plotX;
    plotFrame.y = plotY;
    frame.appendChild(plotFrame);

    if (isPieLikeChart(options.chartType)) {
      await drawPieChart(plotFrame, dataset, options, ensureFont);
    } else if (isRadarChart(options.chartType)) {
      await drawRadarChart(plotFrame, dataset, options, ensureFont);
    } else if (isScatterLikeChart(options.chartType)) {
      await drawScatterChart(plotFrame, dataset, options, ensureFont);
    } else if (isFunnelLikeChart(options.chartType)) {
      await drawFunnelChart(plotFrame, dataset, options, ensureFont);
    } else {
      await drawCartesianChart(plotFrame, dataset, options, ensureFont, options.chartType);
    }

    return frame;
  }

  function chartLabel(type: ChartType): string {
    if (type === 'line') return 'Line';
    if (type === 'area') return 'Area';
    if (type === 'stacked-area') return 'Stacked Area';
    if (type === 'bar') return 'Bar';
    if (type === 'stacked-bar') return 'Stacked Bar';
    if (type === 'pie') return 'Pie';
    if (type === 'radar') return 'Radar';
    if (type === 'scatter') return 'Scatter';
    if (type === 'bubble') return 'Bubble';
    if (type === 'funnel') return 'Funnel';
    if (type === 'convert-funnel') return 'Conversion Funnel';
    return 'Donut';
  }

  function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  async function renderLegend(
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
  ): Promise<FrameNode> {
    const pos = options.legendPosition;
    const isVertical = isVerticalLegend(pos);

    const legend = figma.createFrame();
    legend.name = 'Legend';
    legend.layoutMode = isVertical ? 'VERTICAL' : 'HORIZONTAL';
    legend.primaryAxisSizingMode = 'AUTO';
    legend.counterAxisSizingMode = 'AUTO';
    legend.counterAxisAlignItems = isVertical ? 'MIN' : 'CENTER';
    // 水平布局：项与项之间 20px；垂直布局：6px 行间距更紧凑
    legend.itemSpacing = isVertical ? THEME.spacing.legendItemGapVertical : THEME.spacing.legendItemGap;
    legend.fills = [];

    const items = getLegendItems(dataset, options);

    for (const item of items) {
      const node = figma.createFrame();
      node.name = `Legend Item / ${item.name}`;
      node.layoutMode = 'HORIZONTAL';
      node.primaryAxisSizingMode = 'AUTO';
      node.counterAxisSizingMode = 'AUTO';
      node.counterAxisAlignItems = 'CENTER';
      node.itemSpacing = THEME.spacing.legendShapeGap;
      node.fills = [];

      // 根据图表类型生成对应 shape（遵循 wiki/legend.md）
      const shape = createLegendShape(options.chartType, item.color);
      shape.name = 'Shape';
      node.appendChild(shape);

      const label = await createText(item.name, {
        fontSize: THEME.typography.bodySmall.size,
        lineHeight: THEME.typography.bodySmall.lineHeight,
        color: THEME.colors.legendText.value,
        ensureFont,
      });
      label.name = 'Label';
      node.appendChild(label);

      legend.appendChild(node);
    }

    return legend;
  }

  function isVerticalLegend(pos: LegendPosition): boolean {
    return pos === 'left-center'
      || pos === 'right-center'
      || pos === 'bottom-left'
      || pos === 'bottom-right';
  }

  function alignLegendX(pos: LegendPosition, left: number, right: number, width: number): number {
    if (pos.endsWith('-left')) return left;
    if (pos.endsWith('-right')) return right - width;
    return left + ((right - left) - width) / 2;
  }

  function createLegendShape(chartType: ChartType, color: string): SceneNode {
    if (isLineLikeChart(chartType) || isRadarChart(chartType)) {
      // line / area shape：10 × 2，圆角 2px
      const rect = figma.createRectangle();
      rect.resize(THEME.legend.lineWidth, THEME.legend.lineHeight);
      rect.cornerRadius = THEME.legend.lineRadius;
      setSolidFill(rect, color);
      return rect;
    }
    if (isScatterLikeChart(chartType)) {
      const dot = figma.createEllipse();
      dot.resize(THEME.legend.dotSize, THEME.legend.dotSize);
      setSolidFill(dot, color);
      return dot;
    }
    // 柱状 / 环形 / 饼图：rectangle shape 10 × 10，圆角 2px
    const rect = figma.createRectangle();
    rect.resize(THEME.legend.rectSize, THEME.legend.rectSize);
    rect.cornerRadius = THEME.legend.rectRadius;
    setSolidFill(rect, color);
    return rect;
  }

  function getLegendItems(dataset: ChartDataset, options: ChartOptions): Array<{ name: string; color: string }> {
    if (isPieLikeChart(options.chartType)) {
      return getDonutData(dataset, options.palette).map((item) => ({ name: item.name, color: item.color }));
    }
    if (isScatterLikeChart(options.chartType)) {
      if (options.chartType === 'scatter' && dataset.series.length > 1) {
        return dataset.series.map((series) => ({ name: series.name, color: series.color }));
      }
      if (options.chartType === 'bubble' && dataset.series.length > 3) {
        const groupCount = Math.floor(dataset.series.length / 3);
        return Array.from({ length: groupCount }, (_, index) => {
          const color = paletteColor(options.palette, index);
          const rawName = dataset.series[index * 3]?.name.replace(/\s*X值$/, '').trim();
          return { name: rawName || `类型 ${index + 1}`, color: color.value };
        });
      }
      return [];
    }
    if (isFunnelLikeChart(options.chartType)) return [];
    return dataset.series.map((series) => ({ name: series.name, color: series.color }));
  }

  async function drawCartesianChart(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
    mode: ChartType,
  ): Promise<void> {
    const domain = niceDomain(getCartesianDomainValues(dataset, mode));

    const yTickLabels: TextNode[] = [];
    let yAxisLabelWidth = 0;
    if (options.showAxis) {
      for (const tick of domain.ticks) {
        const label = await createText(formatNumber(tick), {
          fontSize: THEME.typography.bodySmall.size,
          lineHeight: THEME.typography.bodySmall.lineHeight,
          color: THEME.colors.axisLabel.value,
          ensureFont,
        });
        label.name = `Y Label / ${tick}`;
        label.textAlignHorizontal = 'RIGHT';
        yAxisLabelWidth = Math.max(yAxisLabelWidth, Math.ceil(label.width));
        yTickLabels.push(label);
      }
    }

    const padLeft = options.showAxis
      ? yAxisLabelWidth + THEME.spacing.axisLabelGap
      : THEME.spacing.cartesianNoAxisInset;
    const padRight = THEME.spacing.cartesianRightInset;
    const padTop = THEME.spacing.cartesianTopInset;
    const padBottom = options.showAxis
      ? THEME.typography.bodySmall.lineHeight + THEME.spacing.categoryAxisLabelGap
      : THEME.spacing.cartesianNoAxisInset;

    const innerWidth = Math.max(1, plotFrame.width - padLeft - padRight);
    const innerHeight = Math.max(1, plotFrame.height - padTop - padBottom);

    const xToCoord = (index: number, count: number, _isBar: boolean): number => {
      const safeCount = Math.max(1, count);
      // 维度轴默认开启 boundaryGap：折线与柱状都落在类目 band 中心，首尾自然留白。
      if (!THEME.chart.categoryBoundaryGap) {
        if (safeCount <= 1) return padLeft + innerWidth / 2;
        return padLeft + (innerWidth / (safeCount - 1)) * index;
      }
      const step = innerWidth / safeCount;
      return padLeft + step * (index + 0.5);
    };
    const yToCoord = (value: number): number => {
      const ratio = (value - domain.min) / (domain.max - domain.min || 1);
      return padTop + innerHeight * (1 - ratio);
    };

    // 网格线
    if (options.showGrid) {
      const gridGroup = figma.createFrame();
      gridGroup.name = 'Grid Lines';
      gridGroup.resize(plotFrame.width, plotFrame.height);
      gridGroup.fills = [];
      gridGroup.clipsContent = false;
      plotFrame.appendChild(gridGroup);

      for (const tick of domain.ticks) {
        const y = yToCoord(tick);
        const line = figma.createLine();
        line.name = `Grid / ${tick}`;
        line.resize(innerWidth, 0);
        line.x = padLeft;
        line.y = y;
        setSolidStroke(line, THEME.colors.gridLine.value, 1);
        line.dashPattern = [...THEME.spacing.gridDash];
        gridGroup.appendChild(line);
      }
    }

    // Y 轴标签
    if (options.showAxis) {
      const yAxis = figma.createFrame();
      yAxis.name = 'Axis / Y';
      yAxis.resize(yAxisLabelWidth, plotFrame.height);
      yAxis.fills = [];
      yAxis.clipsContent = false;
      plotFrame.appendChild(yAxis);

      for (let i = 0; i < domain.ticks.length; i += 1) {
        const tick = domain.ticks[i];
        const label = yTickLabels[i];
        label.resize(yAxisLabelWidth, label.height);
        label.x = 0;
        label.y = yToCoord(tick) - label.height / 2;
        yAxis.appendChild(label);
      }

      // X 轴底线
      const xLine = figma.createLine();
      xLine.name = 'Axis / X Line';
      xLine.resize(innerWidth, 0);
      xLine.x = padLeft;
      xLine.y = padTop + innerHeight;
      setSolidStroke(xLine, THEME.colors.axisLine.value, 1);
      plotFrame.appendChild(xLine);

      // X 轴标签
      const xAxis = figma.createFrame();
      xAxis.name = 'Axis / X';
      xAxis.resize(plotFrame.width, padBottom);
      xAxis.fills = [];
      xAxis.x = 0;
      xAxis.y = padTop + innerHeight + THEME.spacing.categoryAxisLabelGap;
      xAxis.clipsContent = false;
      plotFrame.appendChild(xAxis);

      const categoryLabelWidth = innerWidth / Math.max(1, dataset.categories.length);
      for (let i = 0; i < dataset.categories.length; i += 1) {
        const label = await createText(dataset.categories[i], {
          fontSize: THEME.typography.bodySmall.size,
          lineHeight: THEME.typography.bodySmall.lineHeight,
          color: THEME.colors.axisLabel.value,
          ensureFont,
        });
        label.name = `X Label / ${dataset.categories[i]}`;
        label.textAlignHorizontal = 'CENTER';
        const x = xToCoord(i, dataset.categories.length, chartFamily(mode) === 'bar') - categoryLabelWidth / 2;
        label.resize(categoryLabelWidth, label.height);
        label.x = x;
        label.y = 0;
        xAxis.appendChild(label);
      }
    }

    // 系列
    if (mode === 'line') {
      await drawLineSeries(plotFrame, dataset, options, ensureFont, xToCoord, yToCoord);
    } else if (mode === 'area' || mode === 'stacked-area') {
      await drawAreaSeries(plotFrame, dataset, options, ensureFont, xToCoord, yToCoord, mode === 'stacked-area');
    } else if (mode === 'stacked-bar') {
      await drawStackedBarSeries(plotFrame, dataset, options, ensureFont, xToCoord, yToCoord);
    } else {
      await drawBarSeries(plotFrame, dataset, options, ensureFont, xToCoord, yToCoord, padTop, innerHeight);
    }
  }

  function getCartesianDomainValues(dataset: ChartDataset, mode: ChartType): number[] {
    if (!isStackedChart(mode)) return dataset.series.flatMap((series) => series.values);
    return dataset.categories.map((_, index) => dataset.series.reduce(
      (sum, series) => sum + Math.max(0, series.values[index] ?? 0),
      0,
    ));
  }

  async function drawLineSeries(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
    xToCoord: (index: number, count: number, isBar: boolean) => number,
    yToCoord: (value: number) => number,
  ): Promise<void> {
    for (const series of dataset.series) {
      const seriesGroup = figma.createFrame();
      seriesGroup.name = `Series / ${series.name}`;
      seriesGroup.resize(plotFrame.width, plotFrame.height);
      seriesGroup.fills = [];
      seriesGroup.clipsContent = false;
      plotFrame.appendChild(seriesGroup);

      const points = series.values.map((value, index) => ({
        x: xToCoord(index, dataset.categories.length, false),
        y: yToCoord(value),
        value,
      }));

      if (points.length >= 2) {
        const commands = points
          .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
          .join(' ');
        const vector = figma.createVector();
        vector.name = `Line / ${series.name}`;
        vector.vectorPaths = [{ windingRule: 'NONZERO', data: commands }];
        vector.strokes = [solidFill(series.color)];
        vector.strokeWeight = 2;
        vector.strokeCap = 'ROUND';
        vector.strokeJoin = 'ROUND';
        vector.fills = [];
        seriesGroup.appendChild(vector);
      }

      // 数据点（mark point）：默认不显示，size=8，外描边 2px 白色
      for (const point of points) {
        if (options.showMarkPoint) {
          const dot = figma.createEllipse();
          dot.name = 'Mark Point';
          const mpSize = THEME.markerPoint.size;
          dot.resize(mpSize, mpSize);
          dot.x = point.x - mpSize / 2;
          dot.y = point.y - mpSize / 2;
          setSolidFill(dot, series.color);
          setSolidStroke(dot, THEME.markerPoint.strokeColor, THEME.markerPoint.strokeWidth);
          dot.strokeAlign = 'OUTSIDE';
          seriesGroup.appendChild(dot);
        }

        if (options.showLabels) {
          const label = await createText(formatNumber(point.value), {
            fontSize: THEME.typography.numberSmall.size,
            color: THEME.colors.title.value,
            ensureFont,
          });
          label.name = 'Data Label';
          label.textAlignHorizontal = 'CENTER';
          label.resize(48, label.height);
          label.x = point.x - 24;
          const mpOffset = options.showMarkPoint
            ? THEME.markerPoint.size / 2 + THEME.markerPoint.strokeWidth
            : 0;
          label.y = point.y - label.height - THEME.spacing.labelGap - mpOffset;
          seriesGroup.appendChild(label);
        }
      }
    }
  }

  async function drawAreaSeries(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
    xToCoord: (index: number, count: number, isBar: boolean) => number,
    yToCoord: (value: number) => number,
    stacked: boolean,
  ): Promise<void> {
    const categoryCount = dataset.categories.length;
    const baselineValues = Array.from({ length: categoryCount }, () => 0);

    for (const series of dataset.series) {
      const seriesGroup = figma.createFrame();
      seriesGroup.name = `Series / ${series.name}`;
      seriesGroup.resize(plotFrame.width, plotFrame.height);
      seriesGroup.fills = [];
      seriesGroup.clipsContent = false;
      plotFrame.appendChild(seriesGroup);

      const lowerValues = stacked ? baselineValues.slice() : Array.from({ length: categoryCount }, () => 0);
      const upperValues = series.values.map((value, index) => lowerValues[index] + Math.max(0, value ?? 0));
      const upperPoints = upperValues.map((value, index) => ({
        x: xToCoord(index, categoryCount, false),
        y: yToCoord(value),
        value,
        rawValue: series.values[index] ?? 0,
      }));
      const lowerPoints = lowerValues.map((value, index) => ({
        x: xToCoord(index, categoryCount, false),
        y: yToCoord(value),
      }));

      if (upperPoints.length >= 2) {
        const areaCommands = [
          ...upperPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
          ...lowerPoints.slice().reverse().map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
          'Z',
        ].join(' ');
        const area = figma.createVector();
        area.name = `Area / ${series.name}`;
        area.vectorPaths = [{ windingRule: 'NONZERO', data: areaCommands }];
        area.fills = [solidFill(series.color, THEME.chart.areaOpacity)];
        area.strokes = [];
        seriesGroup.appendChild(area);

        const lineCommands = upperPoints
          .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
          .join(' ');
        const line = figma.createVector();
        line.name = `Line / ${series.name}`;
        line.vectorPaths = [{ windingRule: 'NONZERO', data: lineCommands }];
        line.strokes = [solidFill(series.color)];
        line.strokeWeight = 2;
        line.strokeCap = 'ROUND';
        line.strokeJoin = 'ROUND';
        line.fills = [];
        seriesGroup.appendChild(line);
      }

      for (const point of upperPoints) {
        if (options.showMarkPoint) {
          const dot = figma.createEllipse();
          dot.name = 'Mark Point';
          const mpSize = THEME.markerPoint.size;
          dot.resize(mpSize, mpSize);
          dot.x = point.x - mpSize / 2;
          dot.y = point.y - mpSize / 2;
          setSolidFill(dot, series.color);
          setSolidStroke(dot, THEME.markerPoint.strokeColor, THEME.markerPoint.strokeWidth);
          dot.strokeAlign = 'OUTSIDE';
          seriesGroup.appendChild(dot);
        }

        if (options.showLabels) {
          const label = await createText(formatNumber(point.rawValue), {
            fontSize: THEME.typography.numberSmall.size,
            color: THEME.colors.title.value,
            ensureFont,
          });
          label.name = 'Data Label';
          label.textAlignHorizontal = 'CENTER';
          label.resize(48, label.height);
          label.x = point.x - 24;
          const mpOffset = options.showMarkPoint
            ? THEME.markerPoint.size / 2 + THEME.markerPoint.strokeWidth
            : 0;
          label.y = point.y - label.height - THEME.spacing.labelGap - mpOffset;
          seriesGroup.appendChild(label);
        }
      }

      if (stacked) {
        for (let i = 0; i < categoryCount; i += 1) {
          baselineValues[i] = upperValues[i];
        }
      }
    }
  }

  async function drawBarSeries(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
    xToCoord: (index: number, count: number, isBar: boolean) => number,
    yToCoord: (value: number) => number,
    padTop: number,
    innerHeight: number,
  ): Promise<void> {
    const categoryCount = dataset.categories.length;
    const seriesCount = Math.max(1, dataset.series.length);
    const slot = (xToCoord(1, categoryCount, true) - xToCoord(0, categoryCount, true)) || 40;
    const categoryWidth = slot - THEME.spacing.barCategoryGap;
    const barWidth = clamp(
      (categoryWidth - THEME.spacing.barGap * (seriesCount - 1)) / seriesCount,
      THEME.chart.barMinWidth,
      THEME.chart.barMaxWidth,
    );

    const baselineY = yToCoord(0);

    for (let seriesIndex = 0; seriesIndex < dataset.series.length; seriesIndex += 1) {
      const series = dataset.series[seriesIndex];
      const seriesGroup = figma.createFrame();
      seriesGroup.name = `Series / ${series.name}`;
      seriesGroup.resize(plotFrame.width, plotFrame.height);
      seriesGroup.fills = [];
      seriesGroup.clipsContent = false;
      plotFrame.appendChild(seriesGroup);

      for (let i = 0; i < categoryCount; i += 1) {
        const value = series.values[i] ?? 0;
        const centerX = xToCoord(i, categoryCount, true);
        const groupLeft = centerX - (barWidth * seriesCount + THEME.spacing.barGap * (seriesCount - 1)) / 2;
        const barX = groupLeft + seriesIndex * (barWidth + THEME.spacing.barGap);
        const valueY = yToCoord(value);
        const barTop = Math.min(valueY, baselineY);
        const barHeight = Math.max(1, Math.abs(valueY - baselineY));

        const bar = figma.createRectangle();
        bar.name = `Bar / ${series.name} / ${dataset.categories[i]}`;
        bar.resize(barWidth, barHeight);
        bar.x = barX;
        bar.y = barTop;
        bar.cornerRadius = 2;
        bar.topLeftRadius = 2;
        bar.topRightRadius = 2;
        bar.bottomLeftRadius = 0;
        bar.bottomRightRadius = 0;
        setSolidFill(bar, series.color);
        seriesGroup.appendChild(bar);

        if (options.showLabels) {
          const label = await createText(formatNumber(value), {
            fontSize: THEME.typography.numberSmall.size,
            color: THEME.colors.title.value,
            ensureFont,
          });
          label.name = 'Data Label';
          label.textAlignHorizontal = 'CENTER';
          label.resize(barWidth + 16, label.height);
          label.x = barX + barWidth / 2 - (barWidth + 16) / 2;
          label.y = barTop - label.height - THEME.spacing.labelGap / 2;
          seriesGroup.appendChild(label);
        }
      }
    }
    void padTop; void innerHeight;
  }

  async function drawStackedBarSeries(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
    xToCoord: (index: number, count: number, isBar: boolean) => number,
    yToCoord: (value: number) => number,
  ): Promise<void> {
    const categoryCount = dataset.categories.length;
    const slot = (xToCoord(1, categoryCount, true) - xToCoord(0, categoryCount, true)) || 40;
    const barWidth = clamp(
      slot - THEME.spacing.barCategoryGap,
      THEME.chart.barMinWidth,
      THEME.chart.barMaxWidth,
    );
    const baselineValues = Array.from({ length: categoryCount }, () => 0);

    for (let seriesIndex = 0; seriesIndex < dataset.series.length; seriesIndex += 1) {
      const series = dataset.series[seriesIndex];
      const isTopSeries = seriesIndex === dataset.series.length - 1;
      const seriesGroup = figma.createFrame();
      seriesGroup.name = `Series / ${series.name}`;
      seriesGroup.resize(plotFrame.width, plotFrame.height);
      seriesGroup.fills = [];
      seriesGroup.clipsContent = false;
      plotFrame.appendChild(seriesGroup);

      for (let i = 0; i < categoryCount; i += 1) {
        const value = Math.max(0, series.values[i] ?? 0);
        const lower = baselineValues[i];
        const upper = lower + value;
        const centerX = xToCoord(i, categoryCount, true);
        const barX = centerX - barWidth / 2;
        const barTop = yToCoord(upper);
        const barBottom = yToCoord(lower);
        const barHeight = Math.max(1, barBottom - barTop);

        const bar = figma.createRectangle();
        bar.name = `Bar / ${series.name} / ${dataset.categories[i]}`;
        bar.resize(barWidth, barHeight);
        bar.x = barX;
        bar.y = barTop;
        bar.cornerRadius = 0;
        bar.topLeftRadius = isTopSeries ? 2 : 0;
        bar.topRightRadius = isTopSeries ? 2 : 0;
        bar.bottomLeftRadius = 0;
        bar.bottomRightRadius = 0;
        setSolidFill(bar, series.color);
        seriesGroup.appendChild(bar);

        if (options.showLabels) {
          const label = await createText(formatNumber(value), {
            fontSize: THEME.typography.numberSmall.size,
            color: THEME.colors.title.value,
            ensureFont,
          });
          label.name = 'Data Label';
          label.textAlignHorizontal = 'CENTER';
          label.resize(barWidth + 16, label.height);
          label.x = centerX - (barWidth + 16) / 2;
          label.y = barTop + (barHeight - label.height) / 2;
          seriesGroup.appendChild(label);
        }

        baselineValues[i] = upper;
      }
    }
  }

  async function drawRadarChart(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
  ): Promise<void> {
    const axisCount = Math.max(3, dataset.categories.length);
    const values = dataset.series.flatMap((series) => series.values);
    const maxValue = Math.max(...values, 1);
    const cx = plotFrame.width / 2;
    const cy = plotFrame.height / 2;
    const radius = Math.max(24, Math.min(plotFrame.width, plotFrame.height) / 2 - 34);
    const angleAt = (index: number): number => -Math.PI / 2 + (Math.PI * 2 * index) / axisCount;
    const coord = (index: number, value: number): { x: number; y: number } => {
      const ratio = clamp(value / maxValue, 0, 1);
      const angle = angleAt(index);
      return {
        x: cx + Math.cos(angle) * radius * ratio,
        y: cy + Math.sin(angle) * radius * ratio,
      };
    };

    if (options.showGrid) {
      const grid = figma.createFrame();
      grid.name = 'Radar Grid';
      grid.resize(plotFrame.width, plotFrame.height);
      grid.fills = [];
      grid.clipsContent = false;
      plotFrame.appendChild(grid);

      for (let step = 4; step >= 1; step -= 1) {
        if (step % 2 !== 0) continue;
        const areaPoints = Array.from({ length: axisCount }, (_, index) => coord(index, (maxValue * step) / 4));
        const splitArea = figma.createVector();
        splitArea.name = `Split Area / ${step}`;
        splitArea.vectorPaths = [{ windingRule: 'NONZERO', data: polygonPath(areaPoints) }];
        splitArea.fills = [solidFill(THEME.colors.category[0].value, 0.04)];
        splitArea.strokes = [];
        grid.appendChild(splitArea);
      }

      for (let step = 1; step <= 4; step += 1) {
        const ringPoints = Array.from({ length: axisCount }, (_, index) => coord(index, (maxValue * step) / 4));
        const ring = figma.createVector();
        ring.name = `Grid Ring / ${step}`;
        ring.vectorPaths = [{ windingRule: 'NONZERO', data: polygonPath(ringPoints) }];
        ring.fills = [];
        setSolidStroke(ring, THEME.colors.gridLine.value, 1);
        ring.dashPattern = [...THEME.spacing.gridDash];
        grid.appendChild(ring);
      }

      for (let index = 0; index < axisCount; index += 1) {
        const end = coord(index, maxValue);
        const spoke = figma.createVector();
        spoke.name = `Grid Axis / ${dataset.categories[index] ?? index + 1}`;
        spoke.vectorPaths = [{ windingRule: 'NONZERO', data: `M ${cx.toFixed(2)} ${cy.toFixed(2)} L ${end.x.toFixed(2)} ${end.y.toFixed(2)}` }];
        spoke.fills = [];
        setSolidStroke(spoke, THEME.colors.gridLine.value, 1);
        grid.appendChild(spoke);
      }
    }

    if (options.showAxis) {
      for (let index = 0; index < axisCount; index += 1) {
        const angle = angleAt(index);
        const labelPoint = {
          x: cx + Math.cos(angle) * (radius + 14),
          y: cy + Math.sin(angle) * (radius + 14),
        };
        const label = await createText(dataset.categories[index] ?? `类别${index + 1}`, {
          fontSize: THEME.typography.bodySmall.size,
          lineHeight: THEME.typography.bodySmall.lineHeight,
          color: THEME.colors.axisLabel.value,
          ensureFont,
        });
        label.name = `Axis Label / ${dataset.categories[index] ?? index + 1}`;
        label.textAlignHorizontal = 'CENTER';
        label.resize(56, label.height);
        label.x = labelPoint.x - 28;
        label.y = labelPoint.y - label.height / 2;
        plotFrame.appendChild(label);
      }
    }

    for (const series of dataset.series) {
      const points = Array.from({ length: axisCount }, (_, index) => coord(index, series.values[index] ?? 0));
      const area = figma.createVector();
      area.name = `Radar Area / ${series.name}`;
      area.vectorPaths = [{ windingRule: 'NONZERO', data: polygonPath(points) }];
      area.fills = [solidFill(series.color, 0.1)];
      setSolidStroke(area, series.color, 2);
      plotFrame.appendChild(area);

      const keyLabelIndex = series.values.reduce((maxIndex, value, index, arr) => (
        value > (arr[maxIndex] ?? Number.NEGATIVE_INFINITY) ? index : maxIndex
      ), 0);
      for (let index = 0; index < points.length; index += 1) {
        const point = points[index];
        if (options.showMarkPoint) {
          const dot = figma.createEllipse();
          dot.name = `Mark Point / ${series.name}`;
          const size = THEME.markerPoint.size;
          dot.resize(size, size);
          dot.x = point.x - size / 2;
          dot.y = point.y - size / 2;
          setSolidFill(dot, series.color);
          setSolidStroke(dot, THEME.markerPoint.strokeColor, THEME.markerPoint.strokeWidth);
          dot.strokeAlign = 'OUTSIDE';
          plotFrame.appendChild(dot);
        }
        if (options.showLabels && index === keyLabelIndex) {
          const label = await createText(formatNumber(series.values[index] ?? 0), {
            fontSize: THEME.typography.numberSmall.size,
            color: THEME.colors.title.value,
            ensureFont,
          });
          label.name = `Key Label / ${series.name}`;
          label.textAlignHorizontal = 'CENTER';
          label.resize(44, label.height);
          label.x = point.x - 22;
          label.y = point.y - label.height - THEME.spacing.labelGap;
          plotFrame.appendChild(label);
        }
      }
    }
  }

  async function drawScatterChart(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
  ): Promise<void> {
    const points = getScatterData(dataset, options.chartType, options.palette);
    if (!points.length) return;

    const xDomain = niceDomain(points.map((point) => point.x));
    const yDomain = niceDomain(points.map((point) => point.y));
    const sizes = points.map((point) => point.size);
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);
    const padLeft = options.showAxis ? 50 : THEME.spacing.cartesianNoAxisInset;
    const padRight = 14;
    const padTop = 14;
    const padBottom = options.showAxis ? 28 : THEME.spacing.cartesianNoAxisInset;
    const innerWidth = Math.max(1, plotFrame.width - padLeft - padRight);
    const innerHeight = Math.max(1, plotFrame.height - padTop - padBottom);
    const xToCoord = (value: number): number => padLeft + innerWidth * ((value - xDomain.min) / (xDomain.max - xDomain.min || 1));
    const yToCoord = (value: number): number => padTop + innerHeight * (1 - ((value - yDomain.min) / (yDomain.max - yDomain.min || 1)));
    const radiusFor = (value: number): number => {
      if (options.chartType === 'scatter') return 4;
      const ratio = (value - minSize) / (maxSize - minSize || 1);
      return 6 + Math.sqrt(Math.max(0, ratio)) * 18;
    };

    if (options.showGrid) {
      for (const tick of yDomain.ticks) {
        const y = yToCoord(tick);
        const line = figma.createLine();
        line.name = `Grid / ${tick}`;
        line.resize(innerWidth, 0);
        line.x = padLeft;
        line.y = y;
        setSolidStroke(line, THEME.colors.gridLine.value, 1);
        line.dashPattern = [...THEME.spacing.gridDash];
        plotFrame.appendChild(line);
      }
    }

    if (options.showAxis) {
      const xLine = figma.createLine();
      xLine.name = 'Axis / X Line';
      xLine.resize(innerWidth, 0);
      xLine.x = padLeft;
      xLine.y = padTop + innerHeight;
      setSolidStroke(xLine, THEME.colors.axisLine.value, 1);
      plotFrame.appendChild(xLine);

      for (const tick of yDomain.ticks) {
        const label = await createText(formatNumber(tick), {
          fontSize: THEME.typography.bodySmall.size,
          lineHeight: THEME.typography.bodySmall.lineHeight,
          color: THEME.colors.axisLabel.value,
          ensureFont,
        });
        label.name = `Y Label / ${tick}`;
        label.textAlignHorizontal = 'RIGHT';
        label.resize(padLeft - 10, label.height);
        label.x = 0;
        label.y = yToCoord(tick) - label.height / 2;
        plotFrame.appendChild(label);
      }

      xDomain.ticks.forEach(async (tick) => {
        const label = await createText(formatNumber(tick), {
          fontSize: THEME.typography.bodySmall.size,
          lineHeight: THEME.typography.bodySmall.lineHeight,
          color: THEME.colors.axisLabel.value,
          ensureFont,
        });
        label.name = `X Label / ${tick}`;
        label.textAlignHorizontal = 'CENTER';
        label.resize(44, label.height);
        label.x = xToCoord(tick) - 22;
        label.y = padTop + innerHeight + THEME.spacing.categoryAxisLabelGap;
        plotFrame.appendChild(label);
      });
    }

    const placedLabels: Array<{ x: number; y: number; width: number; height: number }> = [];
    const overlaps = (
      a: { x: number; y: number; width: number; height: number },
      b: { x: number; y: number; width: number; height: number },
    ): boolean => (
      a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y
    );
    const placeLabel = (label: TextNode, desiredX: number, desiredY: number, radius: number): void => {
      const offsets = [
        { x: 0, y: -radius - THEME.spacing.labelGap / 2 },
        { x: 12, y: -radius - THEME.spacing.labelGap },
        { x: -12, y: -radius - THEME.spacing.labelGap },
        { x: 0, y: radius + label.height + THEME.spacing.labelGap },
        { x: 14, y: 0 },
        { x: -14, y: 0 },
      ];
      for (const offset of offsets) {
        const box = {
          x: clamp(desiredX + offset.x - label.width / 2, 0, plotFrame.width - label.width),
          y: clamp(desiredY + offset.y - label.height, 0, plotFrame.height - label.height),
          width: label.width,
          height: label.height,
        };
        if (!placedLabels.some((placed) => overlaps(box, placed))) {
          label.x = box.x;
          label.y = box.y;
          placedLabels.push(box);
          return;
        }
      }
      const fallback = {
        x: clamp(desiredX - label.width / 2, 0, plotFrame.width - label.width),
        y: clamp(desiredY - radius - label.height - THEME.spacing.labelGap / 2, 0, plotFrame.height - label.height),
        width: label.width,
        height: label.height,
      };
      label.x = fallback.x;
      label.y = fallback.y;
      placedLabels.push(fallback);
    };

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const r = radiusFor(point.size);
      const dotX = xToCoord(point.x);
      const dotY = yToCoord(point.y);
      const dot = figma.createEllipse();
      dot.name = `${options.chartType === 'bubble' ? 'Bubble' : 'Scatter Point'} / ${point.name}`;
      dot.resize(r * 2, r * 2);
      dot.x = dotX - r;
      dot.y = dotY - r;
      setSolidFill(dot, point.color, options.chartType === 'bubble' ? 0.62 : 1);
      dot.strokes = [];
      plotFrame.appendChild(dot);

      if (options.showLabels) {
        const label = await createText(point.name, {
          fontSize: THEME.typography.bodySmall.size,
          lineHeight: THEME.typography.bodySmall.lineHeight,
          color: THEME.colors.title.value,
          ensureFont,
        });
        label.name = `Data Label / ${point.name}`;
        label.textAlignHorizontal = 'CENTER';
        label.resize(clamp(point.name.length * 8 + 12, 52, 120), label.height);
        setTextStroke(label, '#FFFFFF', 2);
        placeLabel(label, dotX, dotY, r);
        plotFrame.appendChild(label);
      }
    }
  }

  function polygonPath(points: Array<{ x: number; y: number }>): string {
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(' ') + ' Z';
  }

  function getScatterData(
    dataset: ChartDataset,
    chartType: ChartType,
    paletteId: PaletteId = 'category',
  ): Array<{ name: string; seriesName: string; seriesIndex: number; x: number; y: number; size: number; color: string; colorToken: string }> {
    if (chartType === 'scatter') {
      return dataset.series.flatMap((series, seriesIndex) => dataset.categories.map((category, index) => ({
        name: dataset.series.length > 1 ? `${category} / ${series.name}` : category,
        seriesName: series.name,
        seriesIndex,
        x: index + 1,
        y: series.values[index] ?? 0,
        size: series.values[index] ?? 1,
        color: series.color,
        colorToken: series.colorToken,
      })));
    }

    const groupCount = Math.max(1, Math.floor(dataset.series.length / 3));
    return Array.from({ length: groupCount }, (_, groupIndex) => {
      const offset = groupIndex * 3;
      const xSeries = dataset.series[offset];
      const ySeries = dataset.series[offset + 1];
      const sizeSeries = dataset.series[offset + 2];
      if (!xSeries || !ySeries) return [];
      const color = paletteColor(paletteId, groupIndex);
      const rawName = xSeries.name.replace(/\s*X值$/, '').trim();
      const seriesName = rawName || (groupCount === 1 ? '气泡图' : `类型 ${groupIndex + 1}`);
      return dataset.categories.map((category, index) => ({
        name: groupCount > 1 ? `${category} / ${seriesName}` : category,
        seriesName,
        seriesIndex: groupIndex,
        x: xSeries.values[index] ?? 0,
        y: ySeries.values[index] ?? 0,
        size: sizeSeries?.values[index] ?? ySeries.values[index] ?? 1,
        color: color.value,
        colorToken: color.token,
      }));
    }).flat();
  }

  async function drawFunnelChart(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
  ): Promise<void> {
    const values = dataset.series[0]?.values ?? [];
    const items = dataset.categories
      .map((name, index) => ({
        name,
        value: Math.max(0, values[index] ?? 0),
        color: funnelColor(index, dataset.categories.length),
      }))
      .filter((item) => item.value > 0);
    if (items.length === 0) return;

    const isConvert = options.chartType === 'convert-funnel';
    if (isConvert) {
      await drawConversionFunnelChart(plotFrame, items, options, ensureFont);
      return;
    }

    const max = Math.max(...items.map((item) => item.value), 1);
    const topInset = 6;
    const bottomInset = 6;
    const plotW = Math.max(120, plotFrame.width);
    const plotH = Math.max(120, plotFrame.height - topInset - bottomInset);
    const centerX = plotW / 2;
    const gap = 2;
    const stageH = (plotH - gap * (items.length - 1)) / items.length;
    const minWidth = plotW * 0.2;
    const widthFor = (value: number) => Math.max(minWidth, plotW * clamp(value / max, 0, 1));

    const group = figma.createFrame();
    group.name = isConvert ? 'Chart / Conversion Funnel' : 'Chart / Funnel';
    group.resize(plotFrame.width, plotFrame.height);
    group.fills = [];
    group.clipsContent = false;
    plotFrame.appendChild(group);

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const topY = topInset + index * (stageH + gap);
      const bottomY = topY + stageH;
      const topW = widthFor(item.value);
      const isLastStage = index === items.length - 1;
      const bottomW = isLastStage
        ? topW
        : widthFor(items[index + 1]?.value ?? item.value);
      const block = figma.createVector();
      block.name = `Funnel / ${item.name}`;
      block.vectorPaths = [{
        windingRule: 'NONZERO',
        data: polygonPath([
          { x: centerX - topW / 2, y: topY },
          { x: centerX + topW / 2, y: topY },
          { x: centerX + bottomW / 2, y: bottomY },
          { x: centerX - bottomW / 2, y: bottomY },
        ]),
      }];
      block.fills = [solidFill(item.color)];
      block.strokes = [solidFill(THEME.colors.card.value)];
      block.strokeWeight = 1;
      group.appendChild(block);

      if (options.showLabels) {
        const label = await createText(`${item.name}  ${formatNumber(item.value)}`, {
          fontSize: THEME.typography.bodySmall.size,
          lineHeight: THEME.typography.bodySmall.lineHeight,
          bold: true,
          color: THEME.colors.card.value,
          ensureFont,
        });
        label.name = `Label / ${item.name}`;
        label.textAlignHorizontal = 'CENTER';
        label.resize(Math.min(topW - 12, 220), label.height);
        label.x = centerX - label.width / 2;
        label.y = topY + stageH / 2 - label.height / 2;
        setTextStroke(label, item.color, 2);
        group.appendChild(label);
      }

    }
  }

  async function drawConversionFunnelChart(
    plotFrame: FrameNode,
    items: Array<{ name: string; value: number; color: string }>,
    options: ChartOptions,
    ensureFont: FontLoader,
  ): Promise<void> {
    const bodyW = Math.max(120, Math.min(plotFrame.height, plotFrame.width * 0.72));
    const bodyH = bodyW;
    const scale = bodyW / 360;
    const desiredRailW = Math.max(86, 120 * scale);
    const bodyX = Math.max(0, (plotFrame.width - bodyW - desiredRailW) / 2);
    const bodyY = Math.max(0, (plotFrame.height - bodyH) / 2);
    const panelRightX = Math.max(bodyX + bodyW + desiredRailW, plotFrame.width - 6);
    const railW = Math.max(1, panelRightX - (bodyX + bodyW));
    const max = Math.max(...items.map((item) => item.value), 1);
    const minWidth = bodyW * 0.2;
    const widthFor = (value: number) => Math.max(minWidth, bodyW * clamp(value / max, 0, 1));
    const unit = bodyH / Math.max(1, (items.length * 3) - 1);
    const itemH = unit * 2;
    const barH = unit;
    const transitionFill = '#CBDEFD';

    const group = figma.createFrame();
    group.name = 'Chart / Conversion Funnel';
    group.resize(plotFrame.width, plotFrame.height);
    group.fills = [];
    group.clipsContent = false;
    plotFrame.appendChild(group);

    let y = bodyY;
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const itemW = widthFor(item.value);
      const itemX = bodyX + (bodyW - itemW) / 2;

      const block = figma.createVector();
      block.name = `Funnel / Item / ${item.name}`;
      block.vectorPaths = [{
        windingRule: 'NONZERO',
        data: polygonPath([
          { x: itemX, y },
          { x: itemX + itemW, y },
          { x: itemX + itemW, y: y + itemH },
          { x: itemX, y: y + itemH },
        ]),
      }];
      block.fills = [solidFill(item.color)];
      block.strokes = [solidFill(THEME.colors.card.value)];
      block.strokeWeight = 1;
      group.appendChild(block);

      if (options.showLabels) {
        const label = await createText(`${item.name} ${formatNumber(item.value)}`, {
          fontSize: THEME.typography.bodySmall.size,
          lineHeight: THEME.typography.bodySmall.lineHeight,
          bold: true,
          color: THEME.colors.card.value,
          ensureFont,
        });
        label.name = `Label / ${item.name}`;
        label.textAlignHorizontal = 'CENTER';
        label.resize(Math.max(106, Math.min(220, itemW + 34)), label.height);
        label.x = itemX + itemW / 2 - label.width / 2;
        label.y = y + itemH / 2 - label.height / 2;
        setTextStroke(label, item.color, 1);
        group.appendChild(label);
      }

      if (index < items.length - 1) {
        const next = items[index + 1];
        const nextW = widthFor(next.value);
        const nextX = bodyX + (bodyW - nextW) / 2;
        const barY = y + itemH;
        const transition = figma.createVector();
        transition.name = `Funnel / Conversion Bar / ${item.name} to ${next.name}`;
        transition.vectorPaths = [{
          windingRule: 'NONZERO',
          data: polygonPath([
            { x: itemX, y: barY },
            { x: itemX + itemW, y: barY },
            { x: nextX + nextW, y: barY + barH },
            { x: nextX, y: barY + barH },
          ]),
        }];
        transition.fills = [solidFill(transitionFill, 0.55)];
        transition.strokes = [solidFill(THEME.colors.card.value)];
        transition.strokeWeight = 1;
        group.appendChild(transition);

        const sourceCenterY = y + itemH / 2;
        const targetCenterY = barY + barH + itemH / 2;
        const sourceEdgeX = itemX + itemW;
        const targetEdgeX = nextX + nextW;
        const labelWidth = Math.max(72, Math.min(106, railW - 20));
        const labelAnchorX = panelRightX - 10;
        const arrowTipX = targetEdgeX + (3 * scale);
        const arrowTailX = Math.min(panelRightX - (14 * scale), arrowTipX + (10 * scale));
        const radius = Math.min(8 * scale, Math.max(4 * scale, Math.abs(targetCenterY - sourceCenterY) * 0.12));
        const labelCenterY = (sourceCenterY + targetCenterY) / 2;
        if (options.showConversionLine) {
          const line = figma.createVector();
          line.name = `Conversion Line / ${item.name} to ${next.name}`;
          line.vectorPaths = [{
            windingRule: 'NONZERO',
            data: [
              `M ${sourceEdgeX.toFixed(2)} ${sourceCenterY.toFixed(2)}`,
              `L ${(panelRightX - radius).toFixed(2)} ${sourceCenterY.toFixed(2)}`,
              `Q ${panelRightX.toFixed(2)} ${sourceCenterY.toFixed(2)} ${panelRightX.toFixed(2)} ${(sourceCenterY + radius).toFixed(2)}`,
              `L ${panelRightX.toFixed(2)} ${(targetCenterY - radius).toFixed(2)}`,
              `Q ${panelRightX.toFixed(2)} ${targetCenterY.toFixed(2)} ${(panelRightX - radius).toFixed(2)} ${targetCenterY.toFixed(2)}`,
              `L ${arrowTailX.toFixed(2)} ${targetCenterY.toFixed(2)}`,
            ].join(' '),
          }];
          line.fills = [];
          line.strokes = [solidFill('#D9D9D9')];
          line.strokeWeight = 1;
          group.appendChild(line);

          const arrow = figma.createVector();
          arrow.name = `Conversion Line Arrow / ${item.name} to ${next.name}`;
          arrow.vectorPaths = [{
            windingRule: 'NONZERO',
            data: polygonPath([
              { x: arrowTipX, y: targetCenterY },
              { x: arrowTailX, y: targetCenterY - (4 * scale) },
              { x: arrowTailX, y: targetCenterY + (4 * scale) },
            ]),
          }];
          arrow.fills = [solidFill('#D9D9D9')];
          arrow.strokes = [];
          group.appendChild(arrow);

          if (options.showConversionLineLabel) {
            const rate = item.value ? `${Math.round((next.value / item.value) * 100)}%` : '-';
            const labelName = await createText(`${next.name}转化率`, {
              fontSize: THEME.typography.bodySmall.size,
              lineHeight: THEME.typography.bodySmall.lineHeight,
              color: THEME.colors.axisLabel.value,
              ensureFont,
            });
            labelName.name = `Conversion Label Name / ${item.name}`;
            labelName.textAlignHorizontal = 'RIGHT';
            labelName.resize(labelWidth, labelName.height);
            labelName.x = labelAnchorX - labelName.width;
            labelName.y = labelCenterY - labelName.height - 5;
            group.appendChild(labelName);

            const rateText = await createText(rate, {
              fontSize: THEME.typography.title.size,
              lineHeight: THEME.typography.title.lineHeight,
              bold: true,
              color: THEME.colors.title.value,
              ensureFont,
            });
            rateText.name = `Conversion Label Value / ${item.name}`;
            rateText.textAlignHorizontal = 'RIGHT';
            rateText.resize(labelWidth, rateText.height);
            rateText.x = labelAnchorX - rateText.width;
            rateText.y = labelCenterY + 2;
            group.appendChild(rateText);
          }
        }
      }

      y += itemH + (index < items.length - 1 ? barH : 0);
    }
  }

  function funnelColor(index: number, count: number): string {
    const colors = ['#3365F7', '#4881FC', '#6F97F9', '#84B1FA', '#A8C8FC', '#CBDEFD'];
    const safeCount = Math.max(1, count);
    const colorIndex = safeCount === 1
      ? 0
      : Math.round(index * (colors.length - 1) / (safeCount - 1));
    return colors[Math.min(colors.length - 1, colorIndex)];
  }

  async function drawPieChart(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
  ): Promise<void> {
    const items = getDonutData(dataset, options.palette);
    if (items.length === 0) return;

    const isDonut = options.chartType === 'donut';
    const size = Math.min(plotFrame.width, plotFrame.height) - 16;
    const cx = plotFrame.width / 2;
    const cy = plotFrame.height / 2;
    const outerR = size / 2;
    const innerRatio = isDonut ? THEME.chart.donutInnerRatio : 0;
    const innerR = outerR * innerRatio;

    const total = items.reduce((sum, item) => sum + item.value, 0) || 1;

    const ring = figma.createFrame();
    ring.name = isDonut ? 'Donut Ring' : 'Pie Slices';
    ring.resize(plotFrame.width, plotFrame.height);
    ring.fills = [];
    ring.clipsContent = false;
    plotFrame.appendChild(ring);

    let start = -Math.PI / 2;
    for (const item of items) {
      const angle = (item.value / total) * Math.PI * 2;
      const end = start + angle;

      // 使用 Figma Ellipse + arcData 实现环形扇区
      // arcData: { startingAngle, endingAngle, innerRadius }
      // - startingAngle/endingAngle 单位为弧度，0 为 3 点钟方向，顺时针为正
      // - innerRadius 为 0~1 的比例值，表达内孔半径占外半径的比例
      const slice = figma.createEllipse();
      slice.name = `Slice / ${item.name}`;
      slice.resize(size, size);
      slice.x = cx - outerR;
      slice.y = cy - outerR;
      slice.arcData = {
        startingAngle: start,
        endingAngle: end,
        innerRadius: innerRatio,
      };
      setSolidFill(slice, item.color);
      // 卡片色描边分隔扇区，外描边以避免占用扇区像素
      slice.strokes = [solidFill(THEME.colors.card.value)];
      slice.strokeWeight = 1;
      slice.strokeAlign = 'OUTSIDE';
      ring.appendChild(slice);

      if (options.showLabels) {
        const mid = (start + end) / 2;
        const labelR = isDonut ? (outerR + innerR) / 2 : outerR * 0.62;
        const lx = cx + Math.cos(mid) * labelR;
        const ly = cy + Math.sin(mid) * labelR;
        const percentage = ((item.value / total) * 100).toFixed(1);
      const label = await createText(`${percentage}%`, {
          fontSize: THEME.typography.numberSmall.size,
          color: THEME.colors.card.value,
          ensureFont,
          bold: true,
        });
        label.name = `Label / ${item.name}`;
        label.textAlignHorizontal = 'CENTER';
        label.resize(48, label.height);
        label.x = lx - 24;
        label.y = ly - label.height / 2;
        ring.appendChild(label);
      }

      start = end;
    }

    if (!isDonut) return;

    // 中心总数
    const totalLabel = await createText(formatNumber(total), {
      fontSize: THEME.typography.donutTotal.size,
      lineHeight: THEME.typography.donutTotal.lineHeight,
      bold: true,
      color: THEME.colors.title.value,
      ensureFont,
    });
    totalLabel.name = 'Donut / Total';
    totalLabel.textAlignHorizontal = 'CENTER';
    totalLabel.resize(120, totalLabel.height);
    const totalCaption = await createText('总计', {
      fontSize: THEME.typography.donutCaption.size,
      lineHeight: THEME.typography.donutCaption.lineHeight,
      color: THEME.colors.textSecondary.value,
      ensureFont,
    });
    totalCaption.name = 'Donut / Caption';
    totalCaption.textAlignHorizontal = 'CENTER';
    totalCaption.resize(120, totalCaption.height);
    const centerTextHeight = totalLabel.height + THEME.spacing.donutCenterGap + totalCaption.height;
    totalLabel.x = cx - 60;
    totalLabel.y = cy - centerTextHeight / 2;
    ring.appendChild(totalLabel);
    totalCaption.x = cx - 60;
    totalCaption.y = totalLabel.y + totalLabel.height + THEME.spacing.donutCenterGap;
    ring.appendChild(totalCaption);
  }

  function donutArcPath(
    cx: number,
    cy: number,
    outerR: number,
    innerR: number,
    start: number,
    end: number,
  ): string {
    // Figma vectorPaths 不支持 A(弧线) 命令，使用三次贝塞尔曲线分段近似圆弧
    // 每段不超过 90° 以保证近似精度
    const outerArc = approximateArc(cx, cy, outerR, start, end, false);
    const innerArc = approximateArc(cx, cy, innerR, end, start, true);
    if (!outerArc || !innerArc) return '';

    const ix1 = cx + Math.cos(end) * innerR;
    const iy1 = cy + Math.sin(end) * innerR;

    return [
      `M ${outerArc.startX.toFixed(3)} ${outerArc.startY.toFixed(3)}`,
      outerArc.commands,
      `L ${ix1.toFixed(3)} ${iy1.toFixed(3)}`,
      innerArc.commands,
      'Z',
    ].join(' ');
  }

  function approximateArc(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number,
    reverse: boolean,
  ): { startX: number; startY: number; commands: string } | null {
    const total = endAngle - startAngle;
    if (Math.abs(total) < 1e-6) return null;

    // 按 90° 分段
    const segmentCount = Math.max(1, Math.ceil(Math.abs(total) / (Math.PI / 2)));
    const delta = total / segmentCount;
    const startX = cx + Math.cos(startAngle) * r;
    const startY = cy + Math.sin(startAngle) * r;

    const parts: string[] = [];
    let curAngle = startAngle;
    for (let i = 0; i < segmentCount; i += 1) {
      const next = curAngle + delta;
      // 控制点�移系数：(4/3) * tan(angle/4)
      const k = (4 / 3) * Math.tan(delta / 4);
      const x1 = cx + Math.cos(curAngle) * r;
      const y1 = cy + Math.sin(curAngle) * r;
      const x2 = cx + Math.cos(next) * r;
      const y2 = cy + Math.sin(next) * r;
      // 控制点：起点切线方向偏移 k*r，终点反向切线偏移 k*r
      const cp1x = x1 - Math.sin(curAngle) * r * k;
      const cp1y = y1 + Math.cos(curAngle) * r * k;
      const cp2x = x2 + Math.sin(next) * r * k;
      const cp2y = y2 - Math.cos(next) * r * k;
      parts.push(
        `C ${cp1x.toFixed(3)} ${cp1y.toFixed(3)} ${cp2x.toFixed(3)} ${cp2y.toFixed(3)} ${x2.toFixed(3)} ${y2.toFixed(3)}`,
      );
      curAngle = next;
    }

    void reverse;
    return { startX, startY, commands: parts.join(' ') };
  }
}
