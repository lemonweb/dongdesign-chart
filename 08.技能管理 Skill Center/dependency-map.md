# Skill Dependency Map

## 1. 文档定位

本文记录 `08.技能管理 Skill Center/` 中各 Skill 之间的调用关系和依赖边界。

Skill 之间只传递任务意图、读取路径和输出结果，不复制 Knowledge Layer 的规范正文。

## 2. Figma 规范转 Wiki 链路

### 2.1 主链路

```txt
Figma URL + 目标 md
→ figma-spec-to-wiki-skill
→ dependency-checker-skill
→ sync-planner-skill
```

### 2.2 依赖关系

| 上游 Skill | 下游 Skill | 触发条件 |
|---|---|---|
| `figma-spec-to-wiki-skill` | `doc-scaffold-skill` | 目标 md 为空、缺少基础章节或需要新建文档 |
| `figma-spec-to-wiki-skill` | `wiki-maintainer-skill` | Figma 内容暴露 Wiki 上游规范缺口 |
| `figma-spec-to-wiki-skill` | `dependency-checker-skill` | 文档完成后检查引用、变量、路径和冲突 |
| `figma-spec-to-wiki-skill` | `visual-auditor-skill` | 目标文档属于视觉语言规范 |
| `dependency-checker-skill` | `sync-planner-skill` | 需要提交、同步或发布到 GitHub / Pages |

### 2.3 运行边界

- `figma-spec-to-wiki-skill` 负责从 Figma 转成 Wiki md。
- `doc-scaffold-skill` 只负责骨架，不判断 Figma 语义。
- `wiki-maintainer-skill` 负责跨目录补缺口。
- `dependency-checker-skill` 负责检查依赖，不改写核心内容。
- `sync-planner-skill` 负责同步计划，不决定文档内容。
