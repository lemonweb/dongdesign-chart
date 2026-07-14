# 颜色令牌规范（东设计 · Design Tokens）

> 本文档为可视化报告 skill 的**唯一颜色来源**。所有组件、图表、文字、背景一律引用下列 token，不再手写散色值。
> 提取自 Figma「dongDesign-Web-（AI）」，token 命名沿用 `--jd-color-*`。

---

## 一、品牌色 Brand（= Info 信息色，同值）

| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-brand-normal` | `#3768FA` | 主品牌色：主按钮、主链接、主折线、强调 |
| `--jd-color-brand-hover` | `#598EF8` | 悬停 |
| `--jd-color-brand-click` | `#1F57C8` | 点击/按下 |
| `--jd-color-brand-disable` | `#ADC7FC` | 禁用 |
| `--jd-color-brand-border` | `#D6E3FD` | 品牌描边 |
| `--jd-color-brand-background` | `#EAF1FE` | 品牌背景 |
| `--jd-color-brand-light-normal` | `#F2F6FE` | 浅品牌底 |
| `--jd-color-brand-light-hover` | `#F6F9FF` | 浅品牌底·悬停 |
| `--jd-color-brand-light-click` | `#E5EDFE` | 浅品牌底·点击 |
| `--jd-color-brand-light-disable` | `#F8FBFF` | 浅品牌底·禁用 |

> `--jd-color-info-*` 与 brand 同值（normal `#3768FA` …），用于信息提示场景。

---

## 二、语义色 Semantic

### 成功 Success（绿）
| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-success-normal` | `#00B26F` | 成功/正向 |
| `--jd-color-success-hover` | `#00CA7F` | 悬停 |
| `--jd-color-success-click` | `#009A5F` | 点击 |
| `--jd-color-success-disable` | `#7EE6B9` | 禁用 |
| `--jd-color-success-border` | `#B8F2D9` | 描边 |
| `--jd-color-success-background` | `#E7F3F0` | 底色（状态提示"良好"底） |

### 警示 Warning（橙）
| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-warning-normal` | `#F08433` | 警示/需关注 |
| `--jd-color-warning-hover` | `#FCA754` | 悬停 |
| `--jd-color-warning-click` | `#C96524` | 点击 |
| `--jd-color-warning-disable` | `#F9C999` | 禁用 |
| `--jd-color-warning-border` | `#FDDEBF` | 描边 |
| `--jd-color-warning-background` | `#FCEFE0` | 底色（状态提示"略低/预警"底） |

### 错误 Error（红）
| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-error-normal` | `#F33B50` | 错误/严重 |
| `--jd-color-error-hover` | `#FB6270` | 悬停 |
| `--jd-color-error-click` | `#C22F40` | 点击 |
| `--jd-color-error-disable` | `#FDB1B3` | 禁用 |
| `--jd-color-error-border` | `#FEDADA` | 描边 |
| `--jd-color-error-background` | `#FCEDED` | 底色（状态提示"危险/跑输"底） |

---

## 三、文字 Text

| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-text-400` | `#1C1D1F` | **主文字**：标题、正文、KPI 数值 |
| `--jd-color-text-300` | `#515357` | **次文字**：卡片标题、副信息、筛选条件 |
| `--jd-color-text-200` | `#8C8D91` | **弱化**：标签、描述、坐标轴、统计周期 |
| `--jd-color-text-100` | `#B0B2B8` | **最弱**：免责声明、占位 |
| `--jd-color-text-white` | `#FFFFFF` | 反白文字（深色底、按钮内） |

> ⚠️ 迁移提示：Header.md 中的 `#262626` → 用 `text-400`（`#1C1D1F`）；`#595959` → 用 `text-300`（`#515357`）。以本表为准。

---

## 四、描边 / 分割线 Line

| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-line-100` | `#E6E7EB` | 浅分割线、卡片分隔 |
| `--jd-color-line-200` | `#DCDDE0` | 卡片描边 |
| `--jd-color-line-300` | `#B0B2B8` | 强描边 |
| `--jd-color-line-white` | `#FFFFFF` | 反白描边 |

> Header.md 中的分割线 `#d9d9d9`、卡片边框 `#ebebeb/#e8e8e8` 统一迁移到 `line-100 / line-200`。

---

## 五、填充 Fill

| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-fill-100` | `#F7F8FA` | 浅灰底：表头、面板底、图片底 |
| `--jd-color-fill-200` | `#F2F4F7` | 进度条轨道、更浅填充 |
| `--jd-color-fill-300` | `#D0D1D6` | 中性填充 |
| `--jd-color-fill-white` | `#FFFFFF` | 白填充 |

---

## 六、背景层级 Surface

| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-surface-100` | `#F2F3F7` | 页面最底层背景 |
| `--jd-color-surface-200` | `#FFFFFF` | 二级背景（卡片/面板） |
| `--jd-color-surface-300` | `#FFFFFF` | 三级背景 |
| `--jd-color-surface-400` | `#FFFFFF` | 四级背景 |
| `--jd-color-surface-500` | `#FFFFFF` | 五级背景 |
| `--jd-color-surface-overlay` | `rgba(0,0,0,.6)` | 遮罩层（弹层背景） |

---

## 七、趋势色 Trend（涨跌）—— ⚠️ 基础约定：红涨绿跌

| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-trend-up-normal` | `#F33B50` | **上涨 = 红** |
| `--jd-color-trend-up-background` | `rgba(243,59,80,.04)` | 上涨浅底 |
| `--jd-color-trend-down-normal` | `#009A5F` | **下跌 = 绿** |
| `--jd-color-trend-down-background` | `rgba(0,178,111,.04)` | 下跌浅底 |
| `--jd-color-trend-even-normal` | `#B0B2B8` | **持平 = 灰** |
| `--jd-color-trend-even-background` | `rgba(181,181,181,.1)` | 持平浅底 |

（各含 hover/click/disable：up `#FB6270`/`#C22F40`/`#FDB1B3`；down `#00CA7F`/`#009A5F`/`#7EE6B9`；even `#C6C7CC`/`#8C8D91`/`#D0D1D6`）

**产品覆盖规则（重要）**：涨跌红绿由**产品**决定，且**可配置切换**（建议做成一个全局开关，而非按组件写死）：
- **对内产品 = 绿升红降**：上涨用 `trend-down` 绿 `#009A5F`、下跌用 `trend-up` 红 `#F33B50`（与基础 token 相反，需翻转）。
- **对外产品 = 红升绿降（红涨绿跌）**：直接用基础 token —— 上涨 `trend-up` 红、下跌 `trend-down` 绿。
- 基础 `--jd-color-trend-up=红 / trend-down=绿` 即**对外默认值**；对内时整体翻转。
- **贡献瀑布图**的负向/正向贡献色，同样跟随该产品开关。

---

## 八、AI 色（紫）

| Token | 值 | 用途 |
|---|---|---|
| `--jd-color-ai-normal` | `#6B36FA` | AI 主色：诊断建议标题渐变、AI 星标图标、重点术语下划线 |
| `--jd-color-ai-hover` | `#9975FC` | 悬停 |
| `--jd-color-ai-click` | `#4B26AF` | 点击 |
| `--jd-color-ai-disable` | `#BEAAF3` | 禁用 |
| `--jd-color-ai-border` | `#EBE5FA` | AI 描边 |
| `--jd-color-ai-background` | `#EDEEFF` | AI 背景 |

> 诊断建议标题渐变：`linear-gradient(259deg,#8F55FD 0%,#6B36FA 30%,#6B36FA 85%,#3544EB 100%)`；
> 诊断条底渐变：`linear-gradient(225deg,#FAF6FF 0%,#F2F5FF 70%,#F1F4FF 100%)`；
> 重点术语下划线：`--jd-color-ai-normal` 20% 透明度（`rgba(107,54,250,.2)`）。

---

## 九、直接引用（CSS 变量块）

```css
:root{
  /* 品牌 / Info */
  --jd-color-brand-normal:#3768FA; --jd-color-brand-hover:#598EF8; --jd-color-brand-click:#1F57C8;
  --jd-color-brand-disable:#ADC7FC; --jd-color-brand-border:#D6E3FD; --jd-color-brand-background:#EAF1FE;
  --jd-color-brand-light-normal:#F2F6FE; --jd-color-brand-light-hover:#F6F9FF;
  --jd-color-brand-light-click:#E5EDFE; --jd-color-brand-light-disable:#F8FBFF;
  /* 成功 / 警示 / 错误 */
  --jd-color-success-normal:#00B26F; --jd-color-success-click:#009A5F; --jd-color-success-border:#B8F2D9; --jd-color-success-background:#E7F3F0;
  --jd-color-warning-normal:#F08433; --jd-color-warning-click:#C96524; --jd-color-warning-border:#FDDEBF; --jd-color-warning-background:#FCEFE0;
  --jd-color-error-normal:#F33B50; --jd-color-error-click:#C22F40; --jd-color-error-border:#FEDADA; --jd-color-error-background:#FCEDED;
  /* 文字 */
  --jd-color-text-400:#1C1D1F; --jd-color-text-300:#515357; --jd-color-text-200:#8C8D91; --jd-color-text-100:#B0B2B8; --jd-color-text-white:#FFFFFF;
  /* 描边 / 填充 / 背景 */
  --jd-color-line-100:#E6E7EB; --jd-color-line-200:#DCDDE0; --jd-color-line-300:#B0B2B8;
  --jd-color-fill-100:#F7F8FA; --jd-color-fill-200:#F2F4F7; --jd-color-fill-300:#D0D1D6;
  --jd-color-surface-100:#F2F3F7; --jd-color-surface-200:#FFFFFF; --jd-color-surface-overlay:rgba(0,0,0,.6);
  /* 趋势（红涨绿跌基础值） */
  --jd-color-trend-up-normal:#F33B50; --jd-color-trend-up-background:rgba(243,59,80,.04);
  --jd-color-trend-down-normal:#009A5F; --jd-color-trend-down-background:rgba(0,178,111,.04);
  --jd-color-trend-even-normal:#B0B2B8; --jd-color-trend-even-background:rgba(181,181,181,.1);
  /* AI 紫 */
  --jd-color-ai-normal:#6B36FA; --jd-color-ai-hover:#9975FC; --jd-color-ai-click:#4B26AF;
  --jd-color-ai-border:#EBE5FA; --jd-color-ai-background:#EDEEFF;
}
```

---

## 十、旧令牌 → 新令牌映射（用于统一存量报告）

| 旧（散值/别名） | 新 Token |
|---|---|
| `--brand-blue #3768FA` | `--jd-color-brand-normal` |
| `--up-red #F33B50` | `--jd-color-trend-up-normal` / `--jd-color-error-normal` |
| `--down-green #009A5F` | `--jd-color-trend-down-normal`（= success-click） |
| `--text-1 #1C1D1F` | `--jd-color-text-400` |
| `--text-2 #515357` | `--jd-color-text-300` |
| `--text-3 #8C8D91` | `--jd-color-text-200` |
| `--text-4 #B0B2B8` | `--jd-color-text-100` |
| `--border-1 #E6E7EB` | `--jd-color-line-100` |
| `--border-2 #DCDDE0` | `--jd-color-line-200` |
| `--bg-gray #F7F8FA` | `--jd-color-fill-100` |
| `--track #F2F4F7` | `--jd-color-fill-200` |
| `--purple #6B36FA` | `--jd-color-ai-normal` |
| Header.md `#262626` | `--jd-color-text-400` |
| Header.md `#595959` | `--jd-color-text-300` |
| Header.md `#d9d9d9 / #ebebeb / #e8e8e8` | `--jd-color-line-100 / line-200` |


---

# 附：文本规范（Typography）

# 文本规范（正文 · 层级 · 字体 · 数值 · 间距）

> 提取自 Figma「文本规范」画板。颜色一律引用《颜色令牌.md》的 `--jd-color-*`；本画板上标注的 `#262626 / #595959 / #EBEBEB` 为旧标签，实际绑定变量为 `text-400 / text-300 / line-100`，以令牌为准。

---

## 一、字体

| 项 | 值 |
|---|---|
| 字体族 | **PingFang SC**（渲染栈建议 `PingFang SC, Roboto, 'Microsoft YaHei', sans-serif`） |
| 常规字重 | Regular = **400** |
| 加粗字重 | Semibold = **600** |

> 注：KPI 指标卡的**核心大数值**另用「京东正黑体 `JDZhengHT-EN-Regular`」，默认 24px、字重 Regular（不得用 Bold/Medium 或系统字体替代）。**必须通过服务端 `@font-face` 引入，不依赖本地字体**：
>
> ```css
> @font-face{
>   font-family:"JDZhengHT-EN-Regular";
>   src:url("https://storage.jd.com/retail-mobile/font/JDZhengHT-EN-Regular.ttf") format("truetype");
>   font-weight:400; font-style:normal; font-display:swap;
> }
> ```
>
> 本文规范的是正文、标题与**行内数值文本**（行内数字用 Roboto）。KPI 卡完整规范见《组件规范/statistics-card.md》。

---

## 二、类型标度 Type Scale（Figma 绑定的字号/行高令牌）

| 字号 | 行高 | 令牌 |
|---|---|---|
| 40px | 60px | `Font/size/40pt` · `line-height/40pt` |
| 24px | 36px | `Font/size/24pt` · `line-height/24pt` |
| 20px | 30px | `Font/size/20pt` · `line-height/20pt` |
| 18px | 28px | `Font/size/18pt` · `line-height/18pt` |
| 16px | 24px | `Font/size/16pt` · `line-height/16pt` |
| 14px | 22px | `Font/size/14pt` · `line-height/14pt` |

---

## 三、文本层级规范

| 类型 | 字号 / 行高 | 字重 | 颜色 | 推荐场景 | 示例 |
|---|---|---|---|---|---|
| 一级标题 | 20 / 30 | Semibold 600 | `text-400` #1C1D1F | 章节 / 核心分析主题 | 销售下滑原因分析 |
| 二级标题 | 18 / 28 | Semibold 600 | `text-400` #1C1D1F | 一级标题下的分析维度 | 流量表现分析 |
| 三级标题 | 16 / 24 | Semibold 600 | `text-400` #1C1D1F | 内容分组 / 关键因素 | 主要影响因素 |
| 正文 | 14 / 22 | Regular 400 | `text-300` #515357 | 解释分析结论 | 从业务维度看，成交下降主要来源于流量减少 |
| 正文加粗 | 14 / 22 | Semibold 600 | `text-300` #515357 | 强调核心判断 | 核心原因是转化效率下降 |
| 基础数值 | 14 / 22 | Semibold 600 | `text-300` #515357 | 行内指标数值描述 | 成交金额 6.18 亿元 |
| 对比值 | 14 / 22 | Semibold 600 | 按报告类型（见第四节） | 趋势变化表达 | 环比下降 6.18% |

> ⚠️ 交叉核对：报告**顶部大标题**（见 Header.md）标注为 30 / 46，不在本标度内（本标度最近为 24/36 或 40/60）。建议与设计确认统一，避免出现规范外字号。

---

## 四、数值规范（行内数值 / 变化值）

| 类型 | 字号 / 行高 | 字重 | 颜色 |
|---|---|---|---|
| 普通数据 | 14 / 22 | Semibold 600 | `text-300` #515357 |
| 负向变化 | 14 / 22 | Semibold 600 | 见下方规则 |
| 正向变化 | 14 / 22 | Semibold 600 | 见下方规则 |

**正 / 负向变化配色 —— 按产品区分（可配置切换）**

"正向变化 = 数值上涨/增长；负向变化 = 数值下降"。红绿映射由**产品**决定，建议做成一个全局开关：

| 产品 | 正向变化（涨） | 负向变化（跌） | 持平 |
|---|---|---|---|
| **对内产品**（绿升红降） | 绿 `trend-down`色 #009A5F | 红 `trend-up`色 #F33B50 | 灰 `trend-even` #B0B2B8 |
| **对外产品**（红升绿降 / 红涨绿跌） | 红 `trend-up` #F33B50 | 绿 `trend-down` #009A5F | 灰 `trend-even` #B0B2B8 |

> 本 Figma 画板示例取自**对内产品**（家电家具事业部经营归因），故图中标注为「负向变化 = #F33B50 红 / 正向变化 = #009A5F 绿」，即绿升红降。落地时先确认产品（对内/对外）再取色，二者仅需翻转 up/down 映射。

---

## 五、间距规范

| 场景 | 间距 |
|---|---|
| 标题 → 正文 | 16px |
| 段落内 正文 → 正文 | 12px |
| 一级标题上方 | 28px |
| 二级标题上方 | 24px |
| 三级标题上方 | 16px |
| 一级段落间 | 24px |
| 正文 → 图表卡片 | 16px |
| 图表卡片 → 正文 | 16px |

---

## 六、段落分隔

| 项 | 规则 |
|---|---|
| 分隔线 | 一级段落之间添加分割线；粗细 1px；颜色 `--jd-color-line-100`（#E6E7EB，Figma 旧标 `#EBEBEB` 迁移至此） |

---

## 七、落地约定

- 所有标题/正文颜色引用令牌：标题 `text-400`、正文/次要 `text-300`、弱化 `text-200`、最弱 `text-100`。
- 行内数值的正负色**不写死**，按当前报告类型套用第四节规则（复用 `--jd-color-trend-*`）。
- 字重仅用 Regular(400) 与 Semibold(600) 两档。
- 间距取值均来自本表，避免随意 padding/margin。
