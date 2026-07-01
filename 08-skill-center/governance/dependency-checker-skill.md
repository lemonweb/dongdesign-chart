# Dependency Checker Skill

## 1. 文档定位

本 Skill 用于检查 Wiki 文档之间、Skill 之间的依赖关系与冲突，确保链接有效、调用边界一致、命名对齐。

它回答：

> 当前改动是否破坏了已有链接、调用链路或命名约定？

本 Skill 不直接修复问题，只输出依赖检查结论与处理建议。

## 2. 触发场景

- “这次改动会不会断链？”
- “帮我看看 Skill 调用关系是否还成立”
- “重命名前先检查一下依赖”
- 由 `wiki-maintainer-skill` / `doc-scaffold-skill` / `design-spec-to-wiki-skill` 完成编辑后回流

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 改动范围 | 必需 | 文件清单或目录 |
| 改动类型 | 必需 | 新增 / 删除 / 重命名 / 内容修改 |
| 上下文链接清单 | 推荐 | 改动前后的内外链 |
| Skill 调用变更 | 推荐 | 是否涉及 registry / dependency-map |

## 4. 必读 Wiki 文件

```txt
ai-file-index.md
README.md
00-overview/ai-reading-flow.md
07-document-governance/metadata-naming-guide.md
08-skill-center/registry.md
08-skill-center/dependency-map.md
08-skill-center/skill-runtime-contract.md
```

## 5. 执行流程

```txt
1. 收集改动文件清单
2. 扫描 Markdown 中的相对链接、锚点链接、图片链接
3. 检查 ai-file-index.md 中是否需要新增、修改或删除条目
4. 检查 Skill 注册表与依赖图是否需要更新
5. 检查命名一致性（kebab-case、目录前缀、英文名）
6. 输出 Dependency Report，分级标注问题
7. 给出修复建议，按需回流到 wiki-maintainer-skill / doc-scaffold-skill
```

## 6. 检查维度

| 维度 | 判断点 |
|---|---|
| 链接完整性 | 跨文件 / 跨目录 / 锚点链接是否可达 |
| 索引完整性 | `ai-file-index.md` 是否覆盖全部新增、删除、重命名 |
| Skill 注册 | registry.md、dependency-map.md 是否已更新 |
| 命名一致性 | 是否触发批量改名风险，已有调用是否同步 |
| 元数据一致性 | 中文名、英文名、关键词是否漂移 |
| 写作规范 | 改动是否与 `07-document-governance/` 中的指南一致 |

## 7. 输出格式

```txt
## 检查范围
改动类型：
影响文件：

## 检查结果
| 级别 | 维度 | 文件 | 问题 | 修复建议 |
|---|---|---|---|---|

## 必要的索引更新
- ai-file-index.md：
- registry.md：
- dependency-map.md：

## 命名 / 路径变更影响
- 直接引用：
- 间接引用：
- 外部引用（脚手架 / 同步包）：

## 回流建议
- 回流 Skill：wiki-maintainer-skill / doc-scaffold-skill / sync-planner-skill
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `wiki-maintainer-skill` | 把检查结果分派到具体修复任务 |
| `doc-scaffold-skill` | 修复缺失骨架引发的断链 |
| `sync-planner-skill` | 处理已对外发布的文档引用 |
| `file-path-finder-skill` | 协助定位被引用方 |

## 9. 不负责事项

- 不直接修改文档或 Skill 文件。
- 不替代图表设计或代码评审。
- 不重写规范正文。
- 不评估业务层数据契约。

## 10. 自查清单

- 是否枚举了改动涉及的全部文件？
- 是否检查了链接、索引、注册表三大维度？
- 是否按严重程度分级标注？
- 是否给出修复建议而非仅暴露问题？
- 是否标注了无法在本 Skill 内修复、需回流的项？
- 是否避免越权修改文档？