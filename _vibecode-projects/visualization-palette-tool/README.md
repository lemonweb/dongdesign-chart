# PaletteLab - 数据可视化色板生成与验证平台

PaletteLab 是一个面向数据可视化设计师、前端工程师和设计体系团队的 Web 原型。它把色板生成、图表场景验证、无障碍模拟、WCAG 对比度、Delta E 距离分析和 Token 导出放在同一个专业工作台里。

## 功能范围

- OKLCH 参数化生成色板。
- 支持分类、顺序、发散、语义四类色板。
- 实时预览柱状图、折线图、热力图。
- 支持色盲、灰度、低对比模拟。
- 计算 WCAG 对比度、Delta E 2000 和综合评分。
- 展示 Hue Wheel、Lightness / Chroma Plot、距离矩阵。
- 导出 CSS Variables、JSON Token、ECharts Theme。

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS 依赖已接入项目骨架；当前 MVP 使用 token-first CSS 完成高保真原型样式，便于在后续接入 Tailwind utilities 或设计系统 tokens。

## 本地运行

```bash
npm install
npm run dev
```

默认地址：

```txt
http://127.0.0.1:5174
```

## 设计原则

- Accessibility First：颜色不能只在普通视觉下成立，必须经色盲、灰度、对比度验证。
- Visualization First：不是只看色块，而是在真实图表场景中检查。
- Scientific but Beautiful：使用 OKLCH / OKLab / Lab 等感知空间指标，同时保持专业设计工具质感。
- Data-dense Dashboard：三栏工作台布局，高信息密度但保持可扫描性。

## 目录

```txt
src/
  App.tsx          页面与组件结构
  styles.css      UI tokens 与响应式样式
  lib/color.ts    色彩转换、生成、模拟、评分、导出逻辑
```
