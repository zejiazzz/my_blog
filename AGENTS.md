# 项目协作机制

## 规则文件

@.rules/multi-agent.md
@.rules/quality.md

## STAR-L 工作流

中高风险需求按以下闭环执行；简单 UI、文案、资源、局部逻辑调整由主 agent 直接完成，不强制创建执行型 spec 或子 agent。

### S · Situation（现状分析）

- 按复杂度决定是否启动 Explore agent 搜索相关代码和调用链，理解现有实现
- 识别约束：模块边界、公开契约、数据来源

### T · Task（任务定义）

- 明确目标结果、允许编辑范围、明确不做、禁止触碰路径

### A · Action（执行方案）

- 按复杂度决定是否启动 Plan agent 做架构决策 → 任务拆解（含依赖关系）→ 多智能体分工
- 性能瓶颈和风险点在设计阶段识别，不在实施后才补救
- 主 agent 按序实施，可并行任务交给独立的 Implement agent

### R · Result（验收）

- 所有代码改动必须由主 agent 自检：需求点、已满足项、未满足项、存疑项、风险与回归点、验证结果
- 中高风险需求或用户明确要求"带验收"时，补只读 Review agent 对照执行型 spec 的 R 节验收：范围、行为、回归、规则合规、质量
- 失败先修实现，通过后再进复盘

### L · Learning（复盘沉淀）

- 验收通过后填写 L 节
- 稳定复发规则 → 回写 `.rules/` 对应文件
- 模块链路变更 → 同步相关 skill 文档
- 判断执行型 spec 去留：delete / archive / keep / promote

## Spec 约定

- 执行型 spec 统一放在 `docs/plans/active/<feature-slug>-spec.md`
- 已完成但需要留痕的执行型 spec 移到 `docs/plans/archive/`
- `docs/specs/<domain>/` 只放长期知识文档，例如 `overview`、`journeys`、`contracts`、`acceptance`，不再作为单次需求的执行型 spec
- 新建执行型 spec 时，优先基于 `docs/plans/templates/feature-spec.template.md`

## 何时创建执行型 spec

中高风险需求（满足任一）在 `docs/plans/active/<feature-slug>-spec.md` 创建执行型 spec：

- 跨模块协作、修改公开接口或生成代码
- 长链路状态流（支付、导出、权限、引导、启动流程）
- 重构影响多个调用方
- 用户明确要求

简单 UI、文案、资源、局部逻辑调整直接执行，不建执行型 spec。

## 执行型 spec 执行时机

- 默认不自动执行，需要等明确指令才执行

## 执行型 spec 处置规则

完成后根据执行型 spec 中 L 节决定：

- **delete**：一次性低复用 → 直接删除 `docs/plans/active/<feature-slug>-spec.md`
- **archive**：需留痕 → 移到 `docs/plans/archive/`
- **keep**：近期继续迭代或仍在开发中 → 保留在 `docs/plans/active/`
- **promote**：可复用规则 → 抽到 `.rules/`、`docs/specs/` 或 skill，再删除/归档执行型 spec

## 部署约定

- 本项目以 Git 远程提交触发部署。
- 修复或功能完成后，如需发布，直接提交并推送远程代码，不需要额外手动触发部署。
- 推送前仍需完成最相关的本地验证，并在最终回复中明确说明验证结果与未验证项。
- 项目部署在vercel,提交github 即可自动部署
- 数据库 使用 supabase，以加载对应的mcp

### 示例场景

- "修改按钮颜色" → 无需 agent，直接处理
- "优化首页加载速度" → 前端 agent + 运维 agent
- "新增用户评论功能" → 产品 agent + 前端 agent + 后端 agent + 测试 agent
- "重构认证系统" → 产品 agent + 前端 agent + 后端 agent + 测试 agent + 运维 agent
