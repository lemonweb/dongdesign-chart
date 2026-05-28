## 1. 目录定位

本目录定义所有图表共享的视觉规则，包括颜色、字体、间距、坐标轴、网格线、图例、标签、提示信息等内容。

它是图表统一风格的基础。

## 2. 使用时机

以下情况应读取本目录：

- 设计图表视觉样式
- 统一多个图表的视觉风格
- 生成 G2 / ECharts 主题配置
- 检查图表是否符合设计体系
- 处理主题模式、状态色、交互反馈

## 3. 读取顺序

建议优先读取：

1. `principle.md`
2. `01-design-language/theme-token.md`
3. `01-design-language/color.md`
4. `01-design-language/typography.md`
5. `layout.md`
6. `01-design-language/axis.md`
7. `01-design-language/legend.md`
8. `01-design-language/label.md`
9. `01-design-language/tooltip.md`

## 4. 不在本目录处理的内容

本目录只定义通用视觉语言，不写单个图表的完整设计指南。

- 柱状图、折线图、饼图等组件规范：查阅 `02-chart-type/`
- 业务看板组合方式：查阅 `03-pattern/`
- G2 / ECharts 代码写法：查阅 `04-adaptation/`