# rules/runtime-wiki-rules · 运行时 Wiki 与外部规范

本 Skill **不内置** dongDesign Chart Wiki 全文，只保留落地所需的规则。涉及更细的图表/组件规范时，按以下优先级处理：

## 一、来源优先级

1. **本 Skill 内的规则/组件文档**（rules/、modules/、mappings/）——首选，已是可直接落地的精简版。
2. **dongDesign Chart Wiki（xingyun.jd.com 内网）**——权威源，但当前执行环境**无法访问内网**（egress 受限）。如需其细则，由用户导出相关页面内容提供，再并入本 Skill。
3. 若二者冲突，以**设计师最新确认 / Figma 实测值**为准，并更新本 Skill 对应文件。

## 二、字体与图片资源（运行时）

- KPI 数值字体：京东正黑体，运行时**用服务端 @font-face**：
  `https://storage.jd.com/retail-mobile/font/JDZhengHT-EN-Regular.ttf`（不依赖本地字体）。
- 头部装饰图：`https://storage.360buyimg.com/ecoplatformsdk/ai-image-space/image.png`，按实际尺寸放置。
- `assets/` 内的 ttf/svg 仅作离线备份，运行时优先服务端资源。

## 三、图表引擎

- 统一 **ECharts**，注册 `echarts-theme.json` 为主题 `jd` 后 `echarts.init(el,'jd')`。
- 若换其他图表库，仍以本 Skill 的分类色板与坐标轴/图例/tooltip 令牌为准，保持一致。

## 四、待补充（缺口）

- `mini-chart`（迷你趋势图/sparkline）细则、`tooltip` 细则尚未沉淀，需要时再补 module/rule。
