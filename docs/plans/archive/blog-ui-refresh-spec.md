# 博客 UI 改造 Spec

## S · Situation（现状分析）

- 背景：
  用户希望用更强的博客化 UI 语言重做当前站点，并明确指出后台富文本区域偏小，切换到 Markdown 后书写空间更窄，影响写作体验。
- 现状实现：
  - 公开站点与后台页面共用根布局里的同一个主内容容器，`/Users/zq/Desktop/my-blog/app/layout.tsx` 直接把所有页面包进 `main.page-container`。
  - `page-container` 在 `/Users/zq/Desktop/my-blog/app/globals.css` 中被固定为 `max-width: 860px`，这对文章阅读页还能接受，但对后台编辑页明显过窄。
  - 首页 `/Users/zq/Desktop/my-blog/app/page.tsx` 主要由单列 hero + 单列卡片列表组成，视觉层级更像“通用内容列表”，缺少博客首页应有的编辑感、期刊感和阅读入口层次。
  - 文章详情页 `/Users/zq/Desktop/my-blog/app/posts/[slug]/page.tsx` 有基础排版，但没有形成稳定的“标题区 / 元信息 / 正文轨道 / 阅读辅助”结构。
  - 编辑器 `/Users/zq/Desktop/my-blog/components/MarkdownEditor.tsx` 目前固定 `height: 520px`，且使用 `previewStyle: 'vertical'`；在容器本就偏窄的情况下，切到 Markdown 会被左右分栏再次压缩。
  - 编辑表单 `/Users/zq/Desktop/my-blog/components/PostForm.tsx` 采用单列卡片堆叠，适合轻表单，不适合“长文写作工作台”。
- 约束：
  - 保持现有技术栈：Next.js App Router、TypeScript、Tailwind + 全局 CSS 变量、Supabase 数据结构不变。
  - 本次先做 UI/UX 改造，不改数据表、不加新依赖、不替换编辑器库。
  - 保留现有中英文、多主题能力，以及现有公开路由和后台路由结构。
  - 参考本机已安装的 `ui-ux-pro-max` 与 `frontend-design` 思路执行，但当前 spec 仍需落在仓库现有规范内。

## T · Task（任务定义）

- 目标：
  - 让公开站点更像“个人博客 / 阅读型出版物”，而不是普通信息卡片站。
  - 让文章详情页具备更稳定的阅读节奏、信息层级和沉浸感。
  - 让后台文章编辑页升级成“写作工作台”，优先解决 Markdown 模式下编辑区过小的问题。
  - 在不引入新设计系统的前提下，沉淀一套更像博客产品的视觉 token 和布局规则。
- 范围：
  - 公共壳层与导航：`/Users/zq/Desktop/my-blog/components/Nav.tsx`
  - 全局设计 token 与布局类：`/Users/zq/Desktop/my-blog/app/globals.css`
  - 首页文章列表：`/Users/zq/Desktop/my-blog/app/page.tsx`
  - 文章卡片：`/Users/zq/Desktop/my-blog/components/PostCard.tsx`
  - 文章详情页：`/Users/zq/Desktop/my-blog/app/posts/[slug]/page.tsx`
  - 后台新建/编辑文章页及表单：`/Users/zq/Desktop/my-blog/app/admin/new/page.tsx`、`/Users/zq/Desktop/my-blog/app/admin/edit/[id]/page.tsx`、`/Users/zq/Desktop/my-blog/components/PostForm.tsx`
  - Markdown 编辑器壳层：`/Users/zq/Desktop/my-blog/components/MarkdownEditor.tsx`
- 非目标：
  - 不修改 Supabase schema、RLS、Auth 流程或 i18n 数据结构。
  - 不新增评论、目录树、搜索、推荐阅读、封面图上传等内容能力。
  - 不替换 Toast UI Editor；若后续体验仍不足，再单独出编辑器替换 spec。
  - 不在本次 spec 中同步改造 Skills、About、MCP 的内容结构，只要求它们后续可继承新的通用视觉 token。
- 禁止触碰：
  - 不改 `/Users/zq/Desktop/my-blog/lib/**` 里的 Supabase 客户端封装。
  - 不引入新的 UI 组件库、动画库、图标库。
  - 不为了视觉改造重写整个路由结构或主题系统。

## A · Action（执行方案）

- 设计方向：
  - 视觉方向定为“Editorial Reading Room（编辑部阅读室）”。
  - 设计主张：前台以阅读沉浸和内容层级为核心，后台以连续写作和低干扰编辑为核心。
  - signature move：用“宽正文轨道 + 紧凑元信息轨道 + 柔和纸感背景”建立博客辨识度，而不是依赖花哨装饰。

- 实现思路：
  1. 先拆壳层，而不是先堆样式。
     - 把“公开阅读页容器”和“后台编辑页容器”从同一个 `page-container` 中解耦。
     - 公开页面保留受控阅读宽度；后台编辑页改为更宽的工作台容器，优先给正文输入区让位。
  2. 重建全局 token，而不是继续在页面里写大量 inline style。
     - 为博客场景补齐更明确的 token：阅读宽度、后台工作区宽度、标题级别、正文行宽、卡片圆角、阴影层级、段落间距、动效节奏。
     - 保持现有暖色系基础，但把“内容阅读”和“后台编辑”做成两套不同密度的 surface 规则。
  3. 首页改造成真正的博客首页。
     - Hero 区从“单纯标题 + 计数”升级为“作者/栏目引导 + 内容定位 + 最新文章入口”。
     - 文章列表从普通堆叠卡片升级为更接近期刊索引的结构，强化标题、摘要、日期和阅读动作的节奏关系。
     - 允许首页在桌面端使用更宽的内容编排，但正文摘要仍遵守阅读宽度约束。
  4. 文章详情页改成稳定的阅读版式。
     - 标题区、导语、时间信息、正文轨道、页尾返回动作要形成清晰层次。
     - 正文宽度控制在适合长文阅读的范围，避免当前既窄又缺少辅助层次的问题。
     - 视情况补充桌面端的轻量阅读辅助，例如标题区留白、分隔、页尾延展区，但不强加复杂侧栏。
  5. 后台编辑页按“写作工作台”改造。
     - 页面层面改为宽容器，至少允许编辑器主体明显宽于公开页正文。
     - 表单布局改为“主编辑区 + 次要设置区”或“主编辑区优先、设置区后置”的结构，减少标题、slug、摘要、发布状态对写作主流程的干扰。
     - 编辑操作区保持清晰主次，保存动作始终易达。
  6. 优先修 Markdown 书写体验。
     - 把编辑器高度从固定 `520px` 改成更接近视口高度的工作区高度，目标为桌面端 70–80vh 的连续书写空间。
     - Markdown 模式避免默认左右等分压缩。优先方案是把 `previewStyle` 调整为 `tab`，让 Markdown 编辑区保持单栏全宽；若保留分栏预览，则只在超宽桌面启用。
     - 补齐 Toast UI 内部区域的 padding、字号、行高和工具栏层级，让 Markdown 与 WYSIWYG 两种模式下的阅读/输入节奏一致。
     - 移动端不追求并排预览，统一降级为单栏输入优先。

- 分阶段执行：
  - Phase 1：壳层与 token 重构
    - 解耦公开页/后台页容器
    - 收敛全局变量和通用类名
    - 清理首页和导航中的关键 inline style
  - Phase 2：公开博客体验改造
    - 首页 hero、文章列表、文章卡片
    - 文章详情页的标题区与正文轨道
  - Phase 3：后台写作体验改造
    - 新建/编辑文章页面布局
    - PostForm 结构调整
    - MarkdownEditor 高度、预览模式、内部留白优化
  - Phase 4：统一 polish
    - 响应式、暗黑模式、焦点态、hover/active/loading 反馈

- 关键规则：
  - 公开阅读页必须遵守阅读宽度，后台编辑页必须优先保证输入宽度。
  - 任何页面只保留一个主要 CTA，其他动作降级。
  - 不再新增大段 inline style；样式尽量沉到全局 token 和语义类名。
  - 动效只做“进入层次”和“交互反馈”，不做无意义装饰。
  - 需要遵守 `prefers-reduced-motion`，并保证键盘焦点可见。

- 风险点：
  - `app/layout.tsx` 当前统一包裹 `page-container`，如果直接修改主容器，需要同时验证公开页和后台页不会互相影响。
  - 文章卡片、关于页、Skills 页、MCP 页可能共用部分全局样式；若只改首页相关类名，需要避免误伤其他内容页。
  - Toast UI Editor 的内部 DOM 结构依赖第三方样式类名，编辑器优化要优先做增量覆盖，不要假设内部结构可完全控制。
  - 若仅靠 CSS 调整仍无法显著改善 Markdown 体验，再追加“编辑器能力增强或替换”方案，但不并入本次首轮实现。

- agent 分工：
  - 本次仅输出执行型 spec，不启动额外写入 agent。
  - 后续若执行实现，建议至少拆成：
    - 前台 UI agent：首页、详情页、导航、全局 token
    - 编辑器 UI agent：后台工作台、PostForm、MarkdownEditor
    - Review agent：只读验收范围、阅读体验与编辑体验回归

- 验证命令：

```bash
npm run lint
npm run check-type
npm run build
```

- 手工验收路径：
  - `/`：检查首页是否具备博客首页层次，而非普通列表页
  - `/posts/<slug>`：检查标题区、正文宽度、段落节奏与回退路径
  - `/admin/new`：检查写作区是否显著变宽
  - `/admin/edit/<id>`：检查切换到 Markdown 后是否仍保持舒适书写宽度
  - 移动端：检查无横向滚动，编辑区不会因分栏预览进一步压缩

## R · Result（验收）

- 需求点清单：
  - 公开站点整体气质更像博客。
  - 首页更像内容首页，而非通用卡片集合。
  - 文章详情页的阅读层级更清晰。
  - 后台编辑页更像写作工作台。
  - Markdown 模式下的编辑区域明显变宽、变高，不再被默认分栏严重压缩。
  - 改造不影响现有数据模型、路由和发布流程。
- 已满足项：
  - 已产出面向本仓库的执行型 spec。
  - 已明确设计方向、范围、非目标、阶段拆分、风险点和验收路径。
  - 已把“博客视觉改造”和“Markdown 编辑器扩容”纳入同一条执行链路。
- 未满足项：
  - 尚未开始代码实现。
  - 尚未做浏览器视觉验证与真实交互回归。
- 存疑项：
  - 是否要把文章详情页加入目录/阅读进度等增强阅读辅助，目前先不纳入首轮。
  - 是否让后台默认进入 Markdown 模式而不是 WYSIWYG，需在实施前按实际写作习惯再确认。
- 风险与回归点：
  - 全局容器重构最容易误伤非博客页面，需要重点回归 `/skills`、`/about`、`/mcp`。
  - 编辑器模式调整可能改变现有少量用户的写作习惯，需要保证切换逻辑仍直观可用。
  - 暗黑模式下的新 token 需要单独验收，避免出现“正文对比不足但按钮很好看”的失衡。
- 验证结果：
  - 本轮仅生成 spec，未运行 `lint` / `check-type` / `build`，因为尚未改动应用代码。
  - 已通过只读代码分析确认问题根因与改造范围：统一窄容器、编辑器固定高度、Markdown 纵向分栏导致可用宽度继续缩小。
- 结论：
  - 可以按本 spec 进入实现阶段，建议先做壳层与编辑器工作台，再做首页和详情页视觉升级。

## L · Learning（复盘沉淀）

- 是否回写规则或 skill：
  - 暂不回写；待实现完成后，如果“公开阅读容器 / 后台编辑容器分离”成为稳定模式，再回写到项目规则或长期 spec。
- 模块知识是否需要同步到 `docs/specs/`：
  - 如实现完成且结构稳定，建议把“公开阅读壳层规则”和“后台写作工作台规则”同步到 `docs/specs/blog/overview.md` 或新的 UI 章节。
- spec 处置结论：`archive`
