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
    if (options.showLegend) {
      legend = await renderLegend(dataset, options, ensureFont);
    }

    // 3) 计算绘图区与图例的位置
    let plotX = innerLeft;
    let plotY = titleBottom;
    let plotWidth = innerWidth;
    let plotHeight = innerBottom - titleBottom;

    if (legend) {
      const pos = options.legendPosition;
      const isHorizontal = pos === 'top-left' || pos === 'top-right'
        || pos === 'bottom-left' || pos === 'bottom-right';

      if (isHorizontal) {
        // 顶部 / 底部图例：占据一行，绘图区扣减相应高度
        const legendH = legend.height;
        if (pos === 'top-left' || pos === 'top-right') {
          legend.y = titleBottom;
          plotY = titleBottom + legendH + gap;
        } else {
          legend.y = innerBottom - legendH;
          plotY = titleBottom;
        }
        plotHeight = innerBottom - plotY - (pos.startsWith('bottom') ? legendH + gap : 0);
        // 水平对齐
        if (pos.endsWith('-left')) legend.x = innerLeft;
        else legend.x = innerRight - legend.width;
      } else {
        // 左中 / 右中图例：占据一列，绘图区扣减相应宽度
        const legendW = legend.width;
        if (pos === 'left-center') {
          legend.x = innerLeft;
          plotX = innerLeft + legendW + gap;
        } else {
          legend.x = innerRight - legendW;
        }
        plotWidth = innerWidth - legendW - gap;
        // 垂直居中相对绘图区
        plotY = titleBottom;
        plotHeight = innerBottom - plotY;
        legend.y = plotY + (plotHeight - legend.height) / 2;
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

    if (options.chartType === 'line') {
      await drawCartesianChart(plotFrame, dataset, options, ensureFont, 'line');
    } else if (options.chartType === 'bar') {
      await drawCartesianChart(plotFrame, dataset, options, ensureFont, 'bar');
    } else {
      await drawDonutChart(plotFrame, dataset, options, ensureFont);
    }

    return frame;
  }

  function chartLabel(type: ChartType): string {
    if (type === 'line') return 'Line';
    if (type === 'bar') return 'Bar';
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
    const isVertical = pos === 'left-center' || pos === 'right-center';

    const legend = figma.createFrame();
    legend.name = 'Legend';
    legend.layoutMode = isVertical ? 'VERTICAL' : 'HORIZONTAL';
    legend.primaryAxisSizingMode = 'AUTO';
    legend.counterAxisSizingMode = 'AUTO';
    legend.counterAxisAlignItems = isVertical ? 'MIN' : 'CENTER';
    // 水平布局：项与项之间 20px；垂直布局：6px 行间距更紧凑
    legend.itemSpacing = isVertical ? THEME.spacing.legendItemGapVertical : THEME.spacing.legendItemGap;
    legend.fills = [];

    const items = options.chartType === 'donut'
      ? getDonutData(dataset, options.palette).map((item) => ({ name: item.name, color: item.color }))
      : dataset.series.map((series) => ({ name: series.name, color: series.color }));

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

  function createLegendShape(chartType: ChartType, color: string): SceneNode {
    if (chartType === 'line') {
      // line shape：10 × 2，圆角 2px
      const rect = figma.createRectangle();
      rect.resize(THEME.legend.lineWidth, THEME.legend.lineHeight);
      rect.cornerRadius = THEME.legend.lineRadius;
      setSolidFill(rect, color);
      return rect;
    }
    // 柱状 / 环形 / 饼图：rectangle shape 10 × 10，圆角 2px
    const rect = figma.createRectangle();
    rect.resize(THEME.legend.rectSize, THEME.legend.rectSize);
    rect.cornerRadius = THEME.legend.rectRadius;
    setSolidFill(rect, color);
    return rect;
  }

  async function drawCartesianChart(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
    mode: 'line' | 'bar',
  ): Promise<void> {
    const allValues = dataset.series.flatMap((series) => series.values);
    const domain = niceDomain(allValues);

    const padLeft = options.showAxis ? 44 : 8;
    const padRight = 12;
    const padTop = 12;
    const padBottom = options.showAxis ? 28 : 8;

    const innerWidth = plotFrame.width - padLeft - padRight;
    const innerHeight = plotFrame.height - padTop - padBottom;

    const xToCoord = (index: number, count: number, isBar: boolean): number => {
      if (count <= 1 && !isBar) return padLeft + innerWidth / 2;
      if (isBar) {
        // 柱状图：每个类目占据一个 slot，柱体置于 slot 中心
        const step = innerWidth / count;
        return padLeft + step * (index + 0.5);
      }
      // 折线图：首尾留白 lineEdgeRatio，避免端点紧贴 Y 轴 / 右边缘
      const edge = innerWidth * THEME.chart.lineEdgeRatio;
      const usableWidth = innerWidth - edge * 2;
      const step = usableWidth / (count - 1);
      return padLeft + edge + step * index;
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
      yAxis.resize(padLeft - THEME.spacing.axisLabelGap, plotFrame.height);
      yAxis.fills = [];
      yAxis.clipsContent = false;
      plotFrame.appendChild(yAxis);

      for (const tick of domain.ticks) {
        const label = await createText(formatNumber(tick), {
          fontSize: THEME.typography.bodySmall.size,
          color: THEME.colors.axisLabel.value,
          ensureFont,
        });
        label.name = `Y Label / ${tick}`;
        label.textAlignHorizontal = 'RIGHT';
        label.resize(padLeft - THEME.spacing.axisLabelGap, label.height);
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
      xAxis.y = padTop + innerHeight + THEME.spacing.axisLabelGap;
      xAxis.clipsContent = false;
      plotFrame.appendChild(xAxis);

      for (let i = 0; i < dataset.categories.length; i += 1) {
        const label = await createText(dataset.categories[i], {
          fontSize: THEME.typography.bodySmall.size,
          color: THEME.colors.axisLabel.value,
          ensureFont,
        });
        label.name = `X Label / ${dataset.categories[i]}`;
        label.textAlignHorizontal = 'CENTER';
        const x = xToCoord(i, dataset.categories.length, mode === 'bar') - 30;
        label.resize(60, label.height);
        label.x = x;
        label.y = 0;
        xAxis.appendChild(label);
      }
    }

    // 系列
    if (mode === 'line') {
      await drawLineSeries(plotFrame, dataset, options, ensureFont, xToCoord, yToCoord);
    } else {
      await drawBarSeries(plotFrame, dataset, options, ensureFont, xToCoord, yToCoord, padTop, innerHeight);
    }
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

      // 数据点（mark point）：默认不显示，size=8，外描边 2px 卡片色
      for (const point of points) {
        if (options.showMarkPoint) {
          const dot = figma.createEllipse();
          dot.name = 'Mark Point';
          const mpSize = THEME.markerPoint.size;
          dot.resize(mpSize, mpSize);
          dot.x = point.x - mpSize / 2;
          dot.y = point.y - mpSize / 2;
          setSolidFill(dot, series.color);
          setSolidStroke(dot, THEME.colors.card.value, THEME.markerPoint.strokeWidth);
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

  async function drawDonutChart(
    plotFrame: FrameNode,
    dataset: ChartDataset,
    options: ChartOptions,
    ensureFont: FontLoader,
  ): Promise<void> {
    const items = getDonutData(dataset, options.palette);
    if (items.length === 0) return;

    const size = Math.min(plotFrame.width, plotFrame.height) - 16;
    const cx = plotFrame.width / 2;
    const cy = plotFrame.height / 2;
    const outerR = size / 2;
    const innerR = outerR * THEME.chart.donutInnerRatio;

    const total = items.reduce((sum, item) => sum + item.value, 0) || 1;

    const ring = figma.createFrame();
    ring.name = 'Donut Ring';
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
        innerRadius: THEME.chart.donutInnerRatio,
      };
      setSolidFill(slice, item.color);
      // 卡片色描边分隔扇区，外描边以避免占用扇区像素
      slice.strokes = [solidFill(THEME.colors.card.value)];
      slice.strokeWeight = 1;
      slice.strokeAlign = 'OUTSIDE';
      ring.appendChild(slice);

      if (options.showLabels) {
        const mid = (start + end) / 2;
        const labelR = (outerR + outerR * THEME.chart.donutInnerRatio) / 2;
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

    // 中心总数
    const totalLabel = await createText(formatNumber(total), {
      fontSize: THEME.typography.title.size,
      lineHeight: THEME.typography.title.lineHeight,
      bold: true,
      color: THEME.colors.title.value,
      ensureFont,
    });
    totalLabel.name = 'Donut / Total';
    totalLabel.textAlignHorizontal = 'CENTER';
    totalLabel.resize(120, totalLabel.height);
    totalLabel.x = cx - 60;
    totalLabel.y = cy - totalLabel.height;
    ring.appendChild(totalLabel);

    const totalCaption = await createText('总计', {
      fontSize: THEME.typography.bodySmall.size,
      color: THEME.colors.textSecondary.value,
      ensureFont,
    });
    totalCaption.name = 'Donut / Caption';
    totalCaption.textAlignHorizontal = 'CENTER';
    totalCaption.resize(120, totalCaption.height);
    totalCaption.x = cx - 60;
    totalCaption.y = cy + 2;
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