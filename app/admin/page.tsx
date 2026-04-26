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
      <div className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
        {tr.loading}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-green)' }}>❯</span> ls -la ./posts --all
          </p>
          <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>
            Admin
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/about" className="font-mono text-xs px-3 py-1.5 rounded transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {tr.editAbout}
          </Link>
          <Link href="/admin/skills" className="font-mono text-xs px-3 py-1.5 rounded transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {tr.editSkills}
          </Link>
          <Link href="/admin/mcp" className="font-mono text-xs px-3 py-1.5 rounded transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {tr.editMcp}
          </Link>
          <Link href="/admin/new" className="btn-primary font-mono">
            {tr.newPost}
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div
          className="font-mono text-sm py-12 text-center rounded-lg"
          style={{ color: 'var(--text-muted)', border: '1px dashed var(--border)' }}
        >
          <span style={{ color: 'var(--accent-red)' }}>!</span> {tr.noPosts}
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div
            className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 font-mono text-xs"
            style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <span>{tr.title}</span>
            <span>{tr.status}</span>
            <span>{tr.actions}</span>
          </div>

          {posts.map((post, i) => (
            <div
              key={post.id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3.5"
              style={{
                background: i % 2 === 0 ? 'var(--bg-card)' : 'transparent',
                borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span className="text-sm font-medium truncate" style={{ color: '#c9d1e0' }}>
                <span className="font-mono text-xs mr-2" style={{ color: 'var(--dim)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {post.title}
              </span>

              <span
                className="font-mono text-xs px-2 py-0.5 rounded"
                style={
                  post.published
                    ? { background: 'rgba(158,206,106,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(158,206,106,0.2)' }
                    : { background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                }
              >
                {post.published ? tr.live : tr.draft}
              </span>

              <div className="flex items-center gap-3 font-mono text-xs">
                <Link href={`/admin/edit/${post.id}`} style={{ color: 'var(--accent)' }} className="hover:underline">
                  edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="transition-colors hover:underline"
                  style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  rm
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
