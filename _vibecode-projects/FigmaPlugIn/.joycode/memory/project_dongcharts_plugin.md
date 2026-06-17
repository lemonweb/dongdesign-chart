---
name: dongCharts Figma 插件
description: dongCharts 插件的当前能力、架构约束与防破坏要点（路径、双引擎、token 化、编译方式）
type: project
---

**路径**：`dongdesign-chart/_vibecode-projects/FigmaPlugIn/dongCharts/`

**能力**：3 类图（折线/柱状/环形）、双引擎导出（ECharts/G2）、8 色板、6 图例位置、数据生成器（2~24 维 × 1~6 指标 × 7 形态）、CSV 系列名重命名、窗口缩放（380~1200×600~1400，clientStorage 键 `dongCharts.ui.size`）。环形用 `EllipseNode.arcData` innerRadius 0.7。

**Why**：用户要求 Figma 图层 / 预览 SVG / 导出代码三处严格一致，所有规范数值 token 化，防止换工具时推倒重做。

**坐标轴规范**：折线图与柱状图统一开启类目轴留白（boundaryGap），点位/柱组落在类目 band 中心；维度轴（X）在 `showAxis=true` 时显示轴线，轴标签居中，距轴线 10px；指标轴（Y）不显示轴线，只显示标签与分隔线，`min=0`、`splitNumber=4`，尽量只保留 5 个值；Y 轴标签右对齐，距离绘图区/网格线左边缘 8px，标签区宽度由最大刻度文本动态决定，不允许固定塞空白；无异轴时右侧不预留无效间距。ECharts 预览、导出代码和 Figma 图层生成必须同步遵守。

**How to apply**：
1. 编译方式是 TS namespace + outFile（tsconfig files 顺序 theme→chart-data→code-export→renderer→code 不可乱），不要改成 ES module
2. Figma 端环形图禁用 vectorPaths 的 A 命令（不支持）；预览端 SVG 可用 A
3. 间距/色值只改 `theme.ts` token，禁止硬编码（如 legendItemGap:20、legendItemGapVertical:8、legendShapeGap:5、axisLabelGap:8、categoryAxisLabelGap:10、donutInnerRatio:0.7、categoryBoundaryGap:true）
4. 改 .ts 必须 `npx tsc` 验证 0 error；改 ui.html 无需打包
5. `renderer.ts` 与 `ui.html` 预览端必须同步改，否则 WYSIWYG 失效
6. dead code：`renderer.ts` 的 `donutArcPath` / `approximateArc` 可清理
7. Frame 命名：`Chart / {折线图|柱状图|环形图} / {ECharts|AntV G2}`
8. 消息协议：cancel / resize / generate-data / export-code / generate
