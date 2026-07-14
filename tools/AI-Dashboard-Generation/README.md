# AI-Dashboard-Generation

本目录是 EasyBI 风格的 AI 数据感知看板本地演示工具。

## 本机运行

```bash
cd tools/AI-Dashboard-Generation
cp .env.example .env.local
# 编辑 .env.local，填入 EASYBI_API_KEY
python3 easybi-proxy.py
```

打开：

```text
http://localhost:8899
```

页面已默认配置为：

- 厂商 / 网关：自定义 / 公司网关
- 接口格式：OpenAI 兼容
- 接口地址：`http://localhost:8899`
- API Key：`proxy`
- 模型名称：`GPT-5.4-joybuilder`

真实上游、模型和 Key 都在 `.env.local` 中配置。当前建议使用 `https://llm-gw.jd.com/v1/chat/completions`。需要改成 Responses API 时，把 `.env.local` 中的 `EASYBI_UPSTREAM_URL` 改为 `/v1/responses`，并把 `EASYBI_UPSTREAM_API` 改成 `responses`。

## 目录说明

- `index.html`：看板生成页面。
- `assets/styles.css`：页面运行样式；不作为 DongDesign 规范源。
- `assets/dongdesign-echarts-theme.js`：基于 Wiki 的 ECharts 运行时适配快照与 option helper，修改前需重新核对 Wiki。
- `assets/app.js`：数据集、模型配置、看板生成、图表渲染和交互逻辑。
- `easybi-proxy.py`：零依赖本地代理，提供页面、受控 Wiki 上下文接口和模型请求转发。
- `.env.example`：本机环境变量模板。
- `dashboard_builder/`：可独立安装到任意 Agent 的看板生成 Skill；本地 Wiki 优先，GitHub Wiki 回退。
- `bak/`：与当前可运行工具不直接相关的资料、旧包和缓存归档。

## 文件关联

```text
浏览器运行：index.html -> assets/styles.css
                       -> assets/dongdesign-echarts-theme.js -> ECharts
                       -> assets/app.js -> /api/wiki-context -> 本地 Wiki / GitHub
                                        -> easybi-proxy.py -> 模型网关

Agent 工作流：dashboard_builder/SKILL.md
             -> scripts/resolve_dongdesign_wiki.py
             -> 本仓库 Wiki，缺失时回退 GitHub Wiki
             -> resources/ / templates/ / examples/
```

网页运行时通过 `/api/wiki-context` 读取与当前需求相关的 Wiki 页面，并把来源、页面清单和 Git SHA 写入生成看板。Skill 仍可单独复制或安装到其他 Agent 环境。

远程模式使用 GitHub `main` 分支的仓库快照作为传输源，一次下载后只向 Agent 注入本次需求相关的页面。`raw.githubusercontent.com` 适合读取路径已知的单个文件，不作为多文档运行时的默认传输方式。核心设计语言、ECharts 适配和自检文档必须完整；远程尚未发布的可选场景增强页会记录在 `missingOptional`，不会被伪装成已读取页面。
