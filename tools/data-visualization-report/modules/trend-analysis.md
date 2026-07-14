# modules/trend-analysis · 趋势 / 图表

报告中的图表组件。统一用 **ECharts** + `echarts-theme.json`（主题 `jd`），配色走 12 色分类色板；涨跌相关按产品规则用 `itemStyle` 覆盖。

## 一、通用

- `echarts.registerTheme('jd', <echarts-theme.json>)` → `echarts.init(el,'jd')`。
- **不写死系列色**：多系列自动按分类色板顺序取色（item-1 蓝、item-2 青…）；单系列默认 item-1。
- 图表放在白卡内容区，容器高度 260–300px；坐标轴/图例/tooltip 由主题统一。
- 缺逐点数据时按文本锚点画示意走势，并注明"示意"。

## 二、常见图表选型（详见 pipeline/chart-selection-rules.md）

| 数据语义 | 图表 |
|---|---|
| 随时间变化 / 双指标（UV×GMV） | 折线 / 双轴折线；关键点用 markLine/markPoint（如"6/30 低谷"） |
| 同比/环比波动 | 柱状（按正负 + 产品规则上色） |
| 转化路径（曝光→点击→加购→订单） | 漏斗（单色系由深到浅；小值也标数值） |
| 维度对总量的正负贡献 | 贡献瀑布（负向红/正向绿/两端灰，随产品） |
| 构成占比 | 环图 / 饼图（分类色板） |
| 多类别对比 | 分组柱 / 条形 |

## 三、示例（双轴趋势）

```js
echarts.init(el,'jd').setOption({
  tooltip:{trigger:'axis'}, legend:{right:0,top:0},
  xAxis:{type:'category',boundaryGap:false,data:days},
  yAxis:[{type:'value',name:'UV'},{type:'value',name:'GMV'}],
  series:[
    {name:'访客 UV',type:'line',data:uv,areaStyle:{}},         // 主题上色 item-1
    {name:'成交金额 GMV',type:'line',yAxisIndex:1,data:gmv}     // item-2
  ]
});
```
