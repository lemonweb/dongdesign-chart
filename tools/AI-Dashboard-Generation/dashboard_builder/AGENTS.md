# Skill 开发规范

## DongDesign Wiki 读取规则

创建或修改任何与数据可视化、图表、Dashboard、数据大屏、视觉规范、图表选型或图表实现有关的 Skill 时，必须遵守以下规则。

### 知识来源

本地 Wiki 是首要知识来源。

远程 Wiki 是本地 Wiki 无法识别、无法读取或缺少相关内容时的备用知识来源：

- Wiki：https://github.com/lemonweb/dongdesign-chart

### 本地 Wiki 识别

按照以下顺序查找本地 Wiki：

1. 用户明确提供的 Wiki 目录。
2. 当前工作区根目录。
3. 当前目录及其父级目录。
4. 当前工作区中包含 Wiki 标志文件的目录。

当一个目录同时包含以下文件时，将其识别为 DongDesign 本地 Wiki 根目录：

- `ai-file-index.md`
- `00-overview/ai-reading-flow.md`

不得在未检查本地工作区的情况下直接读取远程 Wiki。

### 读取流程

成功识别本地 Wiki 后：

1. 先读取 `ai-file-index.md`，根据任务关键词定位文件。
2. 再读取 `00-overview/ai-reading-flow.md`，确定任务对应的读取顺序。
3. 根据当前任务读取必要的 Wiki 页面。
4. 只读取完成任务所需的内容，不要默认加载整个 Wiki。
5. 图表选型、视觉设计、交互设计、数据表达和代码实现，应优先依据本地 Wiki。

### 远程 Wiki 触发条件

只有满足以下情况之一，才读取远程 Wiki：

1. 当前工作区中无法识别本地 Wiki。
2. 本地 Wiki 标志文件不存在。
3. 本地 Wiki 文件无法读取。
4. 本地 Wiki 中不存在完成当前任务所需的内容。
5. 用户明确要求读取远程 Wiki。

读取远程 Wiki 时：

1. 优先读取与当前任务直接相关的页面。
2. 不要默认克隆或加载整个 Wiki。
3. 在最终结果中列出对结论产生实质影响的远程页面链接。
4. 如果能够获取 Git 提交信息，记录参考的提交 SHA。

### Skill 创建规范

1. 每个相关 Skill 的 `SKILL.md` 必须包含“DongDesign Wiki”章节。
2. `SKILL.md` 只保留触发条件、核心流程和知识读取规则。
3. 不要把完整 Wiki 内容复制到 `SKILL.md` 或 `references/`。
4. 新建 Skill 时，必须加入标准“DongDesign Wiki”区块。
5. 修改已有 Skill 时，如果缺少该区块，必须补充。