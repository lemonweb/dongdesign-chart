## 1. 目录定位

本目录用于约束 AI 在图表设计、代码生成和设计走查中的执行行为。
告诉 AI 应该按什么流程工作、必须查阅哪些文档、哪些行为禁止。

## 2. 使用时机

以下情况应读取本目录：

- 使用 CodeX 生成图表代码
- 使用 Stitch / VibeDesign 生成图表 UI
- 使用 VibeCode 基于 G2 / ECharts 技术能力生产图表
- 对已有图表做设计走查
- 需要让 AI 遵循统一设计体系

## 3. 读取顺序

建议按以下顺序读取：

1. `01.VibeDesign规则 VibeDesign-rules.md`
2. `02.VibeCode规则 VibeCode-rules.md`
3. `03.图表生成流程 Generation-flow.md`
4. `04.禁止项 Anti-patterns.md`

## 4. 使用原则

AI 必须遵守：

- 先理解业务问题，再选择图表。
- 先读取视觉语言，再生成样式。
- 代码生成前必须读取引擎适配。
- 不得随机配色。
- 不得跳过字段映射。
- 不得生成无空状态、加载态、异常态的图表方案。
- 不得使用复杂图表表达简单问题。

## 5. 不在本目录处理的内容

- 具体图表怎么设计：查阅 `02.图表模式 Chart-pattern/`
- 具体颜色、字体、轴线规则：查阅 `01.视觉语言 Design-language/`
- 具体 G2 / ECharts 写法：查阅 `04.引擎适配 Engine-adaptation/`