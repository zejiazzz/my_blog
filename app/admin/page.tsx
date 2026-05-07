'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { t } from '@/lib/i18n'
import type { Post } from '@/lib/types'
import type { Lang } from '@/lib/i18n'

function getLang(): Lang {
  if (typeof document === 'undefined') return 'zh'
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
  return (match?.[1] as Lang) || 'zh'
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [lang] = useState<Lang>(() => getLang())
  const tr = t[lang].admin

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setPosts(data || [])
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleDelete(id: number) {
    if (!confirm(tr.deleteConfirm)) return

    const supabase = createClient()
    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) {
      alert(tr.deleteFail)
      return
    }

    setPosts(posts.filter((p) => p.id !== id))
  }

  if (loading) {
    return (
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {tr.loading}
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div className="admin-page-hero" style={{ marginBottom: 0 }}>
          <span className="admin-eyebrow">{tr.editorEyebrow}</span>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
            {tr.adminTitle}
          </h1>
          <p className="admin-page-copy">{tr.adminDescription}</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/about" className="btn-ghost">
            {tr.editAbout}
          </Link>
          <Link href="/admin/skills" className="btn-ghost">
            {tr.editSkills}
          </Link>
          <Link href="/admin/mcp" className="btn-ghost">
            {tr.editMcp}
          </Link>
          <Link href="/admin/new" className="btn-primary">
            {tr.newPost}
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">{tr.noPosts}</div>
      ) : (
        <div className="admin-table">
          <div
            className="admin-table-head"
          >
            <span>{tr.title}</span>
            <span>{tr.status}</span>
            <span>{tr.actions}</span>
          </div>

          {posts.map((post, i) => (
            <div
              key={post.id}
              className="admin-table-row"
              style={{ borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                {post.title}
              </span>

              <span
                className="badge"
                style={
                  post.published
                    ? { background: 'color-mix(in srgb, var(--accent-green) 14%, transparent)', color: 'var(--accent-green)' }
                    : { background: 'var(--bg-elevated)', color: 'var(--text-muted)' }
                }
              >
                {post.published ? tr.live : tr.draft}
              </span>

              <div className="admin-table-actions">
                <Link href={`/admin/edit/${post.id}`} style={{ color: 'var(--accent)' }} className="hover:underline">
                  {tr.editAction}
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="transition-colors hover:underline"
                  style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {tr.deleteAction}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
