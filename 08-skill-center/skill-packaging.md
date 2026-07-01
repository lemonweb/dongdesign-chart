# Skill Packaging Guide

## 1. 目标

本文说明如何让远程 AI Agent 在访问仓库时，按用户点名的 Skill 自动从 Wiki 源文件生成完整可安装包。

日常维护仍然以 Wiki 源文件为准：

```txt
用户指定要安装的 Skill
→ Agent 运行 tools/skill_packager.py
→ 从 Wiki 源文件收集依赖
→ dist/skills/<skill-name>/
→ dist/skills/<skill-name>.zip
```

打包产物只用于安装和分发，不作为维护源，也不需要提前批量生成。

## 2. 为什么需要打包

多数 Agent 从云端仓库安装 Skill 时，只会抓取一个入口 Markdown 文件。如果 Skill 在正文里要求读取 `01-design-language/color.md`、`02-chart-type/selection-rules.md` 等 Wiki 文件，但安装器没有同步这些文件，Skill 就会变成不可执行的“空壳”。

打包脚本会把入口 Skill 和它引用的 Wiki 文件一起镜像到 `references/` 中。安装后的 Agent 即使脱离完整 Wiki，也可以按 `SKILL.md` 顶部的 Packaged Runtime 说明读取依赖。

## 3. 命令

列出可打包的 Skill：

```bash
python3 tools/skill_packager.py --list
```

打包单个 Skill：

```bash
python3 tools/skill_packager.py chart-builder-skill
```

一次打包多个指定 Skill：

```bash
python3 tools/skill_packager.py chart-builder-skill visual-auditor-skill
```

打包全部 Skill：

```bash
python3 tools/skill_packager.py --all
```

严格模式会在路径无法解析时失败：

```bash
python3 tools/skill_packager.py chart-builder-skill --strict
```

## 4. 输出结构

```txt
dist/skills/chart-builder-skill/
  SKILL.md
  INSTALL.md
  package-manifest.json
  references/
    00-overview/
    01-design-language/
    02-chart-type/
    08-skill-center/

dist/skills/chart-builder-skill.zip
```

`SKILL.md` 是安装入口。`references/` 保存原始仓库相对路径的镜像。`package-manifest.json` 记录文件清单、哈希和未解析引用。

## 5. 依赖发现规则

脚本会自动处理：

- Skill 正文中出现的 Wiki 相对路径。
- 代码块中的 `txt` 路径清单。
- 反引号中的下游 Skill 名称，例如 `chart-selector-skill`。
- 目录型 Skill，例如 `business-report-visualizer/SKILL.md` 的同目录辅助文件。
- `skill-package-manifest.json` 中声明的动态路径和补充依赖。

动态占位路径需要在 `skill-package-manifest.json` 中声明。例如：

```json
{
  "placeholderGlobs": {
    "02-chart-type/<category>/<chart>.md": [
      "02-chart-type/**/*.md"
    ]
  }
}
```

## 6. 维护规则

- 修改 Wiki 或 Skill 源文件后，由需要安装的 Agent 重新运行打包命令。
- 不提前维护一份手工复制的 Skill 包；`dist/skills/` 是按需生成物。
- 不手改 `dist/skills/` 里的生成文件。
- 新增动态路径占位符时，同步更新 `skill-package-manifest.json`。
- 新增强依赖 Skill 时，优先在 Skill 正文里写清楚引用；脚本会自动发现反引号中的已注册 Skill 名称。
- 如果某个依赖无法从正文稳定发现，再在 manifest 的 `skills.<name>.include` 或 `includeSkills` 中补充。

## 7. 给其他 Agent 的安装提示

可以直接给其他 Agent 这句话：

```txt
请从这个仓库运行 `python3 tools/skill_packager.py xxx-skill yyy-skill --strict`，然后把 `dist/skills/xxx-skill/` 和 `dist/skills/yyy-skill/` 作为完整 Skill 文件夹安装；如果只能下载压缩包，请使用同名 `.zip`。
```
