# dongCharts 插件接手记忆

## 路径

- 项目根目录：`/Users/wangfei35/Documents/JD-Design-AI-Efficiency/JD-Design-AI-Efficiency/knowledge-base/dongdesign-chart`
- 插件目录：`_vibecode-projects/FigmaPlugIn/dongCharts/`
- 主入口：`ui.html`
- Figma 生成逻辑：`renderer.ts`、`code.ts`
- 主题规范：`theme.ts`
- 数据与导出：`chart-data.ts`、`code-export.ts`
- 资源目录：`asset/`

## 当前能力

- UI 已按设计稿重构为：左侧图表变体、中心预览画布、底部数据配置、右侧配置面板。
- 图表系列已拆为 5 个子页面：折线、柱状、饼图、雷达、散点；`ui.html` 作为 Shell，左侧系列变体区和中心 ECharts 预览区都通过 `iframe srcdoc` 按需加载当前系列子页面，切换系列时卸载旧页面并销毁旧 ECharts 实例，同时记住本系列上一次选中的变体和数据。Figma 运行时仍只通过 manifest 加载 `ui.html`，子页面由 Shell 内联生成，避免 Figma 本地多 HTML 入口兼容风险。
- ECharts 预览 option 已按系列拆为 renderer registry：`PREVIEW_SERIES_RENDERERS` 分发到笛卡尔、饼/环、雷达、散点/气泡各自的 builder；配置/数据/resize 等高频变更统一走 `scheduleRenderPreview()`，同一帧内合并为一次渲染。
- 已支持图表类型/变体：基础折线图、面积图、堆叠面积图、基础柱状图、堆叠柱状图、环形图、饼图、雷达图、散点图、气泡图。
- 预览优先使用 ECharts，创建到 Figma 时仍使用原生 Figma/SVG/矢量生成规则，保证可编辑图层。
- 已支持：图例位置、图例显隐、坐标轴/网格线/数据标签/标记点、标题、规格宽高、色板选择、随机数据生成、预览缩放与拖拽。
- 缩略图和系统图标来自 `asset/`，Figma 插件内需避免依赖不可访问的外链文件路径。

## 硬性约束

- 不要把现有 TS 文件改成模块；保持全局 namespace/outFile 结构。
- 改任何 `.ts` 后必须在插件目录运行：`npx tsc -p tsconfig.json`。
- 环形图/饼图导入 Figma 优先用 `EllipseNode.arcData`，不要用 SVG path 的 `A` 命令转 vectorPaths。
- 间距、字体、颜色、tooltip、图例、坐标轴等规范优先沉淀在 `theme.ts` token，不要散落硬编码。
- `renderer.ts` 的 Figma 输出、`ui.html` 的 ECharts 预览、`code-export.ts` 的导出示例要尽量保持视觉一致。
- 修改 UI 交互后，需要确认浏览器本地页面和 Figma 插件内表现都能工作；Figma 插件内资源加载限制更严格。
- 不要回滚用户已有改动；当前插件目录可能整体未纳入 git 跟踪，属于正常状态。

## dongDesign-charts 关键规范

- 默认维度轴显示轴线；指标轴默认不显示轴线。
- 指标轴分隔尽量控制在 4 段左右，即 5 个刻度值。
- Y 轴标签右对齐，与绘图区保持 8px 间距；标签宽度应按最大刻度值计算，避免额外无效留白。
- 预览卡片 padding 为 20。
- 图例要支持位置回显与交互，图表中的图例样式与 tooltip 中 marker 形态保持一致。
- Tooltip 必须自适应内容尺寸：白底、4px 圆角、`0 4px 16px rgba(0,0,0,.16)` 阴影、上下 8 左右 12 padding、标题与内容 gap 4、内容为 label/value 双列、列间距 8、行高 18。
- 折线/面积类 tooltip marker 使用短线；柱状/饼图类使用小矩形/色块。
- 饼图/环图中心大数值默认 24px，辅助标题 14px，二者 gap 为 4。

## 最近上下文

- 最近用户只要求压缩上下文和清理无意义历史记忆，暂时不要继续处理功能问题。
- 仍需后续接着做的已知方向：检查 tooltip 自适应尺寸是否完全符合 Wiki；必要时同步 Figma/SVG 生成效果。
