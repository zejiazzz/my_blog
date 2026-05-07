# 项目协作入口

本文件只保留项目协作入口和项目特有约定；多智能体、质量、注释、验收等细则以下列规则文件为准：

- @.rules/multi-agent.md
- @.rules/quality.md

## 工作方式

- 默认先做只读分析，理解现有实现后再改
- 简单 UI、文案、资源、局部逻辑调整由主 agent 直接完成
- 中高风险需求按 STAR-L 闭环推进，需要时再启用多 agent 或执行型 spec

## STAR-L（简版）

- S · Situation：确认现状、调用链、约束和影响范围
- T · Task：明确目标、边界、非目标和验收方式
- A · Action：按复杂度决定是否拆任务、建 spec、启用 agent
- R · Result：实现后先自检；中高风险需求或用户要求“带验收”时补只读 Review
- L · Learning：将稳定复用的规则沉淀回 `.rules/` 或长期文档

## 执行型 Spec

- 存放路径：`docs/plans/active/<feature-slug>-spec.md`
- 模板路径：`docs/plans/templates/feature-spec.template.md`
- 完成后的去向：按情况 `delete / archive / keep / promote`
- 长期知识文档统一放在 `docs/specs/<domain>/`

以下情况优先创建执行型 spec：

- 跨模块协作或影响多个调用方
- 修改公开契约、关键状态流或高风险链路
- 用户明确要求先写 spec 或要求带验收推进
- 凡新建 `docs/plans/active/*.md` 的 spec，不论 mini 还是 full，未收到用户明确确认前，不进入代码修改

简单需求直接处理，不强制建 spec。

## 部署与环境

- 项目通过 Git 推送触发部署，Vercel 会自动发布
- 推送前仍需完成最相关验证，并在最终回复中说明已验证项和未验证项
- 数据库相关任务默认按 Supabase 项目处理，优先使用对应 MCP 和官方文档
