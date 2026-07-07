# dongDesign Chart Knowledge Base

本仓库是 dongDesign 图表设计、代码生成、审查与治理的 Wiki 知识库。AI Agent 应优先读取 `ai-file-index.md` 定位文件，再按具体 Skill 声明的必读路径加载上下文。

## 更新记录

Wiki 更新内容记录在 `CHANGELOG.md`。默认采用“按周记录 + 关键变更即时补记”的节奏，便于追踪图表规范、视觉语言、业务场景、工程适配、Skill 和治理规则的变化。

## Agent 安装 Skill

如果你需要把某个 Wiki-backed Skill 安装到其他 AI 工具中，不要只下载单个 Markdown 文件。请让 Agent 在仓库根目录按需运行打包脚本：

```bash
python3 tools/skill_packager.py xxx-skill
```

如果要安装多个 Skill：

```bash
python3 tools/skill_packager.py xxx-skill yyy-skill --strict
```

然后安装生成的完整目录：

```txt
dist/skills/xxx-skill/
```

该目录会包含 `SKILL.md`、`references/` 依赖镜像和 `package-manifest.json`。详细说明见 `08-skill-center/skill-packaging.md`。
