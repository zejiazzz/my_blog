'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import PostForm from '@/components/PostForm'
import { t } from '@/lib/i18n'
import type { Post } from '@/lib/types'
import type { Lang } from '@/lib/i18n'

function getLang(): Lang {
  if (typeof document === 'undefined') return 'zh'
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
  return (match?.[1] as Lang) || 'zh'
}

interface Props {
  params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: Props) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [lang] = useState<Lang>(() => getLang())
  const tr = t[lang].admin
  const supabase = createClient()

  useEffect(() => {
    params.then(async ({ id }) => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', Number(id))
        .maybeSingle()

      setPost(data ?? null)
      setLoading(false)
    }).catch(() => {
      setPost(null)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  if (loading) {
    return (
      <div className="page-shell page-shell--editor">
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {tr.loading}
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="page-shell page-shell--editor">
        <div className="admin-editor-page">
          <div>
            <Link href="/admin" className="back-link back-link--inline">
              {tr.back}
            </Link>
          </div>

          <div className="empty-state empty-state--aligned">
            <span style={{ color: 'var(--accent-red)' }}>!</span>
            <span>{tr.postNotFound}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell page-shell--editor">
      <div className="admin-editor-page">
        <div>
          <Link href="/admin" className="back-link back-link--inline">
            {tr.back}
          </Link>
        </div>
        <div className="admin-page-hero">
          <span className="admin-eyebrow">{tr.editorEyebrow}</span>
          <h1 className="page-title page-title--admin">
            {tr.editPostTitle}
          </h1>
          <p className="admin-page-copy">{tr.editPostDescription}</p>
        </div>
        <PostForm post={post} lang={lang} />
      </div>
    </div>
  )
}
