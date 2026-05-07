# 编辑器语言/主题/粘贴修复 Spec

> 创建：2026-05-07 | 状态：draft → in_progress → completed

## S · Situation（现状分析）

### 需求背景

后台 Markdown 编辑器存在 4 个直接影响写作体验的问题：外部内容粘贴后样式错乱、富文本模式输入文字不可见、深色模式预览区文字发黑、工具栏语言不跟随当前站点语言。

### 现有实现路径

- 入口组件：`components/MarkdownEditor.tsx`
- 表单调用方：`components/PostForm.tsx`、`components/SkillForm.tsx`
- 其他调用方：`app/admin/about/page.tsx`、`app/admin/mcp/page.tsx`
- 样式覆盖：`app/globals.css`
- 语言来源：`lib/i18n.ts`

### 约束条件

- 继续使用 `@toast-ui/editor`，不替换编辑器方案
- 保存格式仍为 Markdown，不改数据库结构
- 做最小修复，不顺手扩后台页面整体文案体系

## T · Task（任务定义）

### 目标结果

后台编辑器在中英文、亮暗色下都能正常显示和输入，工具栏跟随当前语言，外部复制内容进入富文本模式时不再带入错乱样式。

### 范围边界

- 允许修改编辑器组件、相关调用方、全局编辑器样式、Toast UI 类型声明
- 不改前台 Markdown 渲染链路
- 不新增测试框架或替换第三方编辑器

### 非目标

- 不重做后台页面其他非编辑器文案
- 不实现复杂的富文本粘贴保真转换
- 不扩展图片上传、快捷键、自定义插件能力

## A · Action（执行方案）

### 架构决策

- 在 `MarkdownEditor` 内集中接入 Toast UI 的语言、主题和粘贴策略，避免调用方各自分叉
- 富文本粘贴采用“优先纯文本、去样式保内容”的保守方案，优先稳定性
- 深色模式以官方 dark theme + 本地 scoped CSS 覆盖组合实现

### 任务拆解

- [ ] T1: 梳理 Toast UI 的语言、主题、粘贴扩展点 — agent: explore | 产出: 可用接入点清单
- [ ] T2: 改造 `MarkdownEditor`，接入语言/主题/粘贴逻辑 — agent: implement | 依赖: T1 | 产出: 统一编辑器适配层
- [ ] T3: 调整调用方和编辑器样式覆盖 — agent: implement | 依赖: T1 | 产出: 多页面一致的语言与视觉表现（与 T2 并行）
- [ ] T4: 运行相关检查并做页面回归验证 — agent: review | 依赖: T2, T3 | 产出: 验证结果与风险说明

### 风险与性能关注

- 重新初始化编辑器时要避免丢失当前 Markdown 内容
- 粘贴去样式策略要避免影响图片/文件类剪贴板
- 深色模式覆盖需要只作用于编辑器内容区，避免污染全局 UI

## R · Result（验收标准）

### 核心验收点

- 中文站点下编辑器工具栏与模式切换显示中文，英文站点下显示英文
- 深色模式下 Markdown 预览区、富文本编辑区文字可见
- 富文本模式可正常输入，输入后立即可见
- 从外部 Markdown 内容粘贴到富文本模式时，不再带入错乱样式

### 回归关注

- 现有文章/技能/关于/MCP 页面仍能正常加载编辑器
- 编辑器内容保存后仍以 Markdown 提交，不影响原有保存流程

### 验证方式

- 运行 `npm run lint`
- 运行 `npm run type-check`
- 本地启动后台页面，手动验证中英文、亮暗色、富文本输入和粘贴行为

## L · Learning（复盘沉淀）

> 验收通过后填写

### 新增/更新规则 → 目标文件

### 需同步的 skill 或模块文档

### Plan 处置

<!-- decision: delete | archive | keep | promote -->
<!-- reason: 命中的判断条件 -->
<!-- destination: 归档路径 或 none -->
<!-- 模块知识是否需要同步到 `docs/specs/`： -->
