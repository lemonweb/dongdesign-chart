# Wiki Maintainer Skill

## 1. 文档定位

本 Skill 用于维护 dongdesign-chart Wiki 的整体一致性，包括补齐缺口、修正交叉引用、统一命名与元数据、回收过期内容。

它回答：

> 当前 Wiki 中存在哪些结构缺口、引用断链或命名漂移？应该按什么顺序修复？

本 Skill 不重写规范正文，只组织治理任务、调度其他治理 Skill 完成实际编辑。

## 2. 触发场景

- “帮我巡检 Wiki 看看哪里需要补”
- “最近改了几个文件，检查一下一致性”
- “这周的 Wiki 维护计划帮我列一下”
- 由 `design-spec-to-wiki-skill` 在转写完成后回流暴露规范缺口

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 治理范围 | 必需 | 全量 / 某个目录 / 某次改动 |
| 触发原因 | 必需 | 例行巡检 / 单次维护 / 规范缺口回写 |
| 时间预算 | 推荐 | 优先级排序依据 |
| 既有缺口清单 | 推荐 | 来自历史维护记录或 Audit |

## 4. 必读 Wiki 文件

```txt
README.md
ai-file-index.md
00-overview/README.md
00-overview/how-to-use.md
00-overview/ai-reading-flow.md
07-document-governance/general-writing-principles.md     # 缺失时按“规范不足”处理
07-document-governance/metadata-naming-guide.md
07-document-governance/readme-writing-guide.md           # 缺失时按“规范不足”处理
07-document-governance/chart-component-writing-guide.md
08-skill-center/registry.md
08-skill-center/dependency-map.md
08-skill-center/skill-runtime-contract.md
```

## 5. 执行流程

```txt
1. 锁定治理范围与触发原因
2. 扫描目标目录，识别空文件、缺章节、断链、命名漂移
3. 对照 ai-file-index.md 检查中文名、关键词、英文名是否对齐
4. 按治理优先级排序（P0：影响 AI 阅读链路 > P1：影响选型/落码 > P2：影响阅读体验）
5. 制定治理任务清单，分发给：
   - doc-scaffold-skill（骨架补齐）
   - dependency-checker-skill（依赖检查）
   - design-spec-to-wiki-skill（设计规范转写）
   - sync-planner-skill（同步发布）
6. 跟踪任务状态并回写 ai-file-index.md
```

## 6. 治理维度

| 维度 | 判断点 |
|---|---|
| 结构完整性 | 目录与必备文件是否齐备 |
| 章节完整性 | 必备章节是否存在且非空 |
| 索引一致性 | `ai-file-index.md` 是否覆盖全部文件 |
| 命名一致性 | 文件名、目录名、变量名是否符合命名规则 |
| 引用一致性 | 跨文件链接是否有效 |
| 元数据 | frontmatter / 元信息是否齐备 |
| 过期回收 | 是否存在历史遗留或重复内容 |

## 7. 输出格式

```txt
## 治理范围
范围：
原因：
时间预算：

## 缺口清单
| 优先级 | 文件 | 问题 | 建议处理 Skill | 备注 |
|---|---|---|---|---|

## 修复计划
- 阶段 1（P0）：
- 阶段 2（P1）：
- 阶段 3（P2）：

## 待回写索引
- ai-file-index.md 更新项：

## 风险与遗留
- 规范缺口：
- 依赖 Skill 缺失：
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `doc-scaffold-skill` | 补齐骨架 |
| `dependency-checker-skill` | 检查跨文件依赖 |
| `design-spec-to-wiki-skill` | 从设计规范回填内容 |
| `sync-planner-skill` | 维护完成后规划同步发布 |
| `file-path-finder-skill` | 定位需要维护的文件 |

## 9. 不负责事项

- 不直接重写规范正文（交给具体 Skill 或人工）。
- 不替代图表选型与生成。
- 不修改 Skill 注册表（需要通过 PR 流程）。
- 不发起代码层迁移。

## 10. 自查清单

- 是否锁定治理范围？
- 是否按优先级排序？
- 是否给每个缺口指派下游 Skill？
- 是否更新 `ai-file-index.md`？
- 是否避免越权重写核心规范？
- 是否标注无法在本轮治理处理的遗留项？