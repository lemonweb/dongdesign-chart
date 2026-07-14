# Worked Example — 从一句业务诉求到成品看板

一个端到端示例，串起本 skill 的布局推导与运行时 Wiki 读取流程：**看数路径→布局**（`layout_logic.md`）+ **选什么图/长什么样/怎么交互**（DongDesign Chart Wiki）。这是推导过程的演示，不是可套用的固定模板。

---

## 0. 业务诉求（用户输入）

> “帮我生成一个 618 大促复盘看板，适合老板汇报，重点看 GMV、利润、爆品和区域表现，风格高级一点。”

数据集：电商经营明细（GMV、利润、利润率、订单量、转化率、退款率；维度：品类、商品、区域、渠道、店铺；日期）。

---

## 1. 看数意图 → 核心判断任务

- 主意图：**分析**（复盘：发生了什么、为什么、下一步）；次意图：总览（老板先要结论）、对比（区域/品类差异）。
- 核心判断任务：大促是否达成、增长来自哪里、利润是否健康、哪里有风险、下一步做什么。

## 2. 看数路径（从通用步骤中选用）

```
标题/口径说明 → 核心结果 → 趋势变化 → 维度拆解(品类/爆品) → 归因定位(区域/风险) → 后续动作
```

（本例弱化“对象明细”——老板汇报不需要逐单核查。）

## 3. 步骤权重

| 看数步骤 | 权重 | 理由 |
|---|---|---|
| 核心结果 | 高 | 老板汇报，先给结论和达成 |
| 维度拆解（品类/爆品） | 高 | “重点看爆品”被显式点名 |
| 趋势变化 | 中 | 需要看节奏，但不是主诉求 |
| 归因定位（区域/风险） | 中 | “区域表现” + 复盘要找风险 |
| 后续动作 | 中 | 复盘落到动作 |
| 对象明细 | 低 | 老板视角不需要 |

## 4. 信息优先级

结论 & 核心 KPI（最高，首屏放大）> 品类/爆品拆解 & 趋势（次高）> 区域/风险归因（中）> 行动建议（末端）。

## 5. 4×N 栅格拼版（本例 4×6）

```
行1  [ ██████████  ① 核心结论 Hero（通栏 span4）  ██████████ ]
行2  [ GMV ][ 利润 ][ 利润率 ][ 订单量 ]      ② 核心KPI（1+1+1+1）
行3  [ ███ ③ GMV/利润趋势（跨3列） ███ ][ 达成/同比 ]   主次 3+1
行4  [ ███ ④ 品类贡献(跨2) ███ ][ ███ ⑤ 爆品Top(跨2) ███ ]  对比 2+2
行5  [ ███ ⑥ 区域表现(跨3) ███ ][ 风险提示 ]     主次 3+1
行6  [ ██████████  ⑦ 行动建议（通栏 span4）  ██████████ ]
```

每块的 whyHere：① 结论权重最高→通栏置顶；② KPI 一行四个便于扫读；③ 趋势要横向空间→跨3列；④⑤ 品类与爆品是维度拆解、同级→2+2 并列；⑥ 区域归因占主区、旁置风险；⑦ 动作放路径末端。

## 6. 按 DongDesign Wiki 选图并实现

| 模块 | 看数步骤 | 候选表达 | 运行时必读 Wiki |
|---|---|---|---|
| ① 核心结论 Hero | 核心结果 | 叙事结论 | `03-pattern/` 对应场景、视觉语言与设计自查 |
| ② 核心 KPI×4 | 核心结果 | 指标卡/迷你趋势 | `02-chart-type/other/statistics-card.md`、`mini-chart.md` |
| ③ GMV/利润趋势 | 趋势变化 | 折线或双轴 | 折线/双轴文档、ECharts 适配与代码自查 |
| ④ 品类贡献 | 维度拆解 | 条形排行或构成图 | 选型规则、条形/构成类图表文档 |
| ⑤ 爆品 Top | 维度拆解 | 排行或明细 | 条形图、标签、Tooltip 与交互文档 |
| ⑥ 区域表现 | 归因定位 | 柱状或排行 | 柱状图、颜色语义与标注规则 |
| 风险提示 | 归因定位 | 洞察卡/告警 | 可视化增强与数据证据规则 |
| ⑦ 行动建议 | 后续动作 | 动作列表 | 场景页面模式与布局规则 |

运行前先执行 `scripts/resolve_dongdesign_wiki.py --task dashboard`；生成 ECharts 代码时再执行 `--task code`，并把实际读取的文件写入 `visualStandard.pages`。

## 7. 生成的 Dashboard Spec（节选，与 templates/schema 对齐）

```json
{
  "dashboardMeta": { "title": "618大促经营复盘看板", "scenario": "campaign_review", "audience": "executive", "stylePreset": "executive_report" },
  "layout": {
    "ref": "resources/layout_logic.md",
    "primaryIntent": "分析",
    "readingPath": ["标题/口径说明","核心结果","趋势变化","维度拆解","归因定位","后续动作"],
    "stepWeights": { "核心结果": "high", "维度拆解": "high", "趋势变化": "mid", "归因定位": "mid", "后续动作": "mid", "对象明细": "low" },
    "grid": "4xN",
    "sectionsLayout": [
      { "sectionKey": "summary",   "combo": "通栏",    "span": 4, "rows": 1, "whyHere": "核心结论权重最高，通栏置顶" },
      { "sectionKey": "kpi",       "combo": "1+1+1+1", "span": 1, "rows": 1, "whyHere": "四个核心指标一行扫读" },
      { "sectionKey": "trend",     "combo": "主次3+1",  "span": 3, "rows": 1, "whyHere": "趋势需横向空间，旁置达成/同比" },
      { "sectionKey": "category",  "combo": "对比2+2",  "span": 2, "rows": 1, "whyHere": "品类贡献维度拆解，并列比较" },
      { "sectionKey": "hotitems",  "combo": "对比2+2",  "span": 2, "rows": 1, "whyHere": "爆品被点名，与品类同级并列" },
      { "sectionKey": "region",    "combo": "主次3+1",  "span": 3, "rows": 1, "whyHere": "区域归因占主区，旁置风险" },
      { "sectionKey": "action",    "combo": "通栏",    "span": 4, "rows": 1, "whyHere": "后续动作放看数路径末端" }
    ]
  },
  "visualStandard": {
    "name": "dongdesign-chart",
    "source": "local",
    "root": "/path/to/dongdesign-chart",
    "pages": ["01-design-language/README.md", "04-adaptation/echarts-adapter.md"],
    "commitSha": "optional"
  },
  "vibeCodingSpec": {
    "designSystem": "dongdesign", "chartEngine": "echarts"
  },
  "sections": [
    { "sectionKey": "trend", "chart": "line", "metrics": ["gmv","profit"], "dimensions": ["date"], "whyChart": "趋势变化用折线，双轴看 GMV 与利润" }
  ]
}
```

## 8. 迭代（自然语言修改如何落回布局与 Wiki）

- “把利润放第一屏” → 调 `stepWeights` 抬高利润 → 信息优先级变化 → KPI/趋势顺序前移（layout）。
- “换成深色大屏” → 重新读取 Wiki 主题与 ECharts 适配页面，更新实现，布局结构不变。
- “区域换成渠道” → 替换数据契约中的拆解维度，并按 Wiki 重新确认图表选型，布局槽位不变。

> 关键：一切修改都能追溯到 **看数意图/权重（为什么这样排）** 或 **视觉标准（长什么样）**，而不是随意调整。
