# 图表配色与 ECharts 主题（Chart Theme）

> 提取自 Figma「可视化分类色板」。方案：不逐个图表建规范，而是用一份 **ECharts 主题**统一所有图表的配色与视觉风格。主题文件见同目录 `echarts-theme.json`。

---

## 一、分类色板（Categorical Palette）

多系列（柱 / 折线 / 饼 / 环 / 雷达等）按顺序取用；`item-1` 为默认首色。

| 顺序 | 令牌 | 色值 | 参考色相 |
|---|---|---|---|
| 1 | `分类色板/item-1` | `#3365F7` | 品牌蓝 |
| 2 | `分类色板/item-2` | `#30CAFA` | 亮青 |
| 3 | `分类色板/item-3` | `#0B2165` | 深藏蓝 |
| 4 | `分类色板/item-4` | `#EF69CA` | 品红 |
| 5 | `分类色板/item-5` | `#FFBA30` | 琥珀黄 |
| 6 | `分类色板/item-6` | `#16C87F` | 绿 |
| 7 | `分类色板/item-7` | `#482AC4` | 紫 |
| 8 | `分类色板/item-8` | `#FF6D4E` | 橙红 |
| 9 | `分类色板/item-9` | `#B8CE92` | 橄榄绿 |
| 10 | `分类色板/item-10` | `#004B91` | 深蓝 |
| 11 | `分类色板/item-11` | `#008FCA` | 海蓝 |
| 12 | `分类色板/item-12` | `#D1DEF3` | 浅蓝灰 |

> 单系列图表默认用 `item-1`（品牌蓝 `#3365F7`）。类别数 ≤ 12 时按序取色；超过 12 类应考虑合并"其他"或改图表类型。

---

## 二、主题统一管控的内容

`echarts-theme.json` 里已经把这些和令牌对齐，注册后**所有图表自动生效**：

- **序列色**：上面 12 色分类色板。
- **坐标轴**：类目轴 `axisLine` 用 `line-100`(#E6E7EB)、无 tick；轴文字 `#8C8C8C` 12px；数值轴无轴线、只保留横向 `splitLine`(#F0F0F0)。
- **图例**：圆角小色块（`roundRect`，14×8），文字 `text-300`(#515357) 12px。
- **Tooltip**：深色底 `#1C1D1F`、圆角 6、白字、`axisPointer` 用 `line-200`。
- **折线**：平滑 `smooth`、线宽 2、默认不显点（hover 才显）。
- **柱状**：顶部圆角 4、最大宽度 32。
- **饼 / 环**：切片白描边 1px。
- **字体**：`PingFang SC`（数值可在 series 上单独指定 `Roboto`）。
- **grid**：`containLabel: true`，四周留白。

---

## 三、如何使用

```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
<script>
  // 1) 载入主题（把 echarts-theme.json 内容内联或 fetch 进来）
  const jdTheme = /* echarts-theme.json 的内容 */;
  echarts.registerTheme('jd', jdTheme);

  // 2) 初始化图表时传入主题名，即自动套用配色与风格
  const chart = echarts.init(document.getElementById('chart'), 'jd');
  chart.setOption({
    // 只写数据与图表类型，配色/坐标轴/tooltip 都由主题接管
    xAxis: { type: 'category', data: ['A','B','C'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [120, 200, 150] }]
  });
</script>
```

> 若报告 HTML 需自包含，可把 `echarts-theme.json` 的对象直接内联进 `<script>`，无需外部请求。

---

## 四、涨跌色（不进分类色板，数据驱动）

分类色板用于**区分类别**；而**涨跌/正负变化**属于语义、按数据正负 + 产品规则上色，**不使用分类色板**，需在 series/数据项上单独指定：

| 场景 | 取色 |
|---|---|
| 上涨 / 正向 | 对外产品：`trend-up` #F33B50（红）；对内产品：`#009A5F`（绿） |
| 下跌 / 负向 | 对外产品：`trend-down` #009A5F（绿）；对内产品：`#F33B50`（红） |
| 持平 | `trend-even` #B0B2B8（灰） |

**同比/环比柱、贡献瀑布**等涨跌相关图表，应按每个数据点的正负 + 当前产品规则，用 `itemStyle.color` 覆盖主题色（详见《color-tokens.md》第七节与产品规则）。

---

## 五、落地约定

- 所有 ECharts 图表统一 `registerTheme('jd', …)` 后用 `echarts.init(el, 'jd')`，不在每张图里手写颜色。
- 需要涨跌语义色时，用 `itemStyle`/`lineStyle` 按产品规则覆盖，不从分类色板取。
- 图表卡片外框、标题、间距遵循《report-layout.md》（圆角 8、内边距 16）。
- 若改用其他图表库（Chart.js 等），同样以本色板为序列色、以本文令牌为坐标轴/图例/tooltip 样式，保持一致。
