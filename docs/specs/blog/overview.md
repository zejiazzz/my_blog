# Blog And Skills Overview

## 目标

提供一个个人内容系统，其中 `posts` 负责文章发布，`skills` 负责可复用知识和脚手架沉淀。

## 范围

- 公开文章列表与详情。
- 公开 Skills 列表与详情。
- Supabase Auth 后台登录。
- 文章 CRUD。
- Skills CRUD。
- About 和 MCP 单例页面管理。

## 非目标

- Skills 不复用 posts 表。
- 不做评论、点赞、收藏和全文搜索。
- 不做多用户角色系统；当前只区分匿名和 authenticated。

## 外部依赖

- Supabase URL、anon key、service role key。
- RSS 源可用性。
