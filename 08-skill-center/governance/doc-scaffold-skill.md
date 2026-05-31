# Doc Scaffold Skill

## 1. 文档定位

本 Skill 用于按文档治理规则创建或补全 Wiki 文档骨架（标题、章节、frontmatter、占位说明），不填充语义正文。

它回答：

> 当前要新建或补全的 Markdown 应该使用哪种骨架？需要哪些章节？元数据如何写？

本 Skill 不撰写规范内容，只输出骨架。语义填充由 `design-spec-to-wiki-skill`、`wiki-maintainer-skill` 或人工完成。

## 2. 触发场景

- “给我建一个新图表组件文档骨架”
- “这个目录缺 README，先把骨架立起来”
- “按 Wiki 规则补一个 self-check 文档骨架”
- 由 `wiki-maintainer-skill` 在巡检发现空文件 / 缺章节时调用

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 目标文件路径 | 必需 | 相对仓库根路径 |
| 文档类型 | 必需 | README / 图表组件 / 视觉语言 / 引擎适配 / 规则 / 自查 / 场景 / Skill |
| 主题关键词 | 推荐 | 用于占位说明 |
| 元数据 | 推荐 | 中文名、英文名、关键词、所属目录 |

## 4. 必读 Wiki 文件

```txt
07-document-governance/general-writing-principles.md     # 缺失时按“规范不足”处理
07-document-governance/readme-writing-guide.md           # 缺失时按“规范不足”处理
07-document-governance/chart-component-writing-guide.md
07-document-governance/design-language-writing-guide.md  # 缺失时按“规范不足”处理
07-document-governance/engine-adapter-writing-guide.md   # 缺失时按“规范不足”处理
07-document-governance/core-rules-writing-guide.md       # 缺失时按“规范不足”处理
07-document-governance/scenario-writing-guide.md         # 缺失时按“规范不足”处理
07-document-governance/self-check-writing-guide.md       # 缺失时按“规范不足”处理
07-document-governance/ai-rules-writing-guide.md         # 缺失时按“规范不足”处理
07-document-governance/metadata-naming-guide.md
```

## 5. 执行流程

```txt
1. 解析文档类型与目标路径
2. 选择对应写作指南并加载骨架模板
3. 生成 frontmatter / 元数据占位
4. 输出标准章节标题与占位说明
5. 在每个章节标注“待补充”，避免被误用为规范
6. 输出 Scaffold Packet 与后续填充建议
```

## 6. 骨架规则

| 维度 | 规则 |
|---|---|
| 标题层级 | H1 仅一个，二级章节使用 H2 |
| 章节命名 | 按对应写作指南规定的中文章节名 |
| 占位文本 | 显式标注“待补充”，并提示填充方法 |
| 元数据 | 中文名、英文名、关键词与 `ai-file-index.md` 对齐 |
| 链接 | 跨文档链接使用相对路径 |
| 长度 | 骨架文件不应包含规范正文 |

## 7. 输出格式

```txt
## 骨架概览
目标路径：
文档类型：
依据指南：

## 骨架内容
```markdown
# 标题

## 1. ...
（待补充）

## 2. ...
（待补充）
```

## 元数据建议
- ai-file-index.md 新增条目：
  - 中文名：
  - 英文名：
  - 关键词：

## 后续填充建议
- 由哪个 Skill 接续：
- 必读上游文档：
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `wiki-maintainer-skill` | 上游，分派骨架任务 |
| `design-spec-to-wiki-skill` | 下游，把设计规范填进骨架 |
| `dependency-checker-skill` | 检查骨架是否触发新的链接缺口 |
| `file-path-finder-skill` | 定位骨架目标路径 |

## 9. 不负责事项

- 不撰写规范正文。
- 不复制其他文档内容。
- 不修改 Skill 注册表与运行契约。
- 不发起目录或文件批量重命名。

## 10. 自查清单

- 是否选择了正确的写作指南？
- 章节是否齐备且与指南一致？
- 占位文本是否显式标注“待补充”？
- 元数据是否完整？
- 是否避免在骨架中混入规范正文？
- 是否给出后续填充建议？