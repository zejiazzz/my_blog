# 执行型 Spec 目录说明

## 目录用途

- `active/`：当前正在执行或待执行的需求 spec。
- `archive/`：已经完成且需要留痕的历史 spec。
- `templates/`：新建 spec 时使用的模板。

## 使用规则

- 单次需求的执行型 spec 统一命名为 `docs/plans/active/<feature-slug>-spec.md`。
- 执行完成后，根据 L 节结论决定 `delete / archive / keep / promote`。
- 长期领域知识文档统一放在 `docs/specs/<domain>/`，不放在这里。

## 最小结构

执行型 spec 至少包含以下章节：

- `## S · Situation`
- `## T · Task`
- `## A · Action`
- `## R · Result`
- `## L · Learning`
