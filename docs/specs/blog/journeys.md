# Journeys

## 访客阅读文章

1. 访问 `/`。
2. 系统只展示 `published = true` 的文章。
3. 点击文章进入 `/posts/[slug]`。
4. 如果 slug 不存在或未发布，返回 404。

## 访客阅读 Skill

1. 访问 `/skills`。
2. 系统只展示 `published = true` 的 Skills。
3. 点击 Skill 进入 `/skills/[slug]`。
4. 如果 slug 不存在或未发布，返回 404。
5. 根据 `lang` cookie 展示中文或英文内容，英文缺失时回退中文。

## 管理员维护 Skill

1. 未登录访问 `/admin/skills` 会被 Proxy 重定向到 `/login`。
2. 登录后访问 `/admin/skills` 查看全部 Skills。
3. 管理员可以新建、编辑、删除 Skill。
4. 只有发布后的 Skill 会出现在公开列表。
