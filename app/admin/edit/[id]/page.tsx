'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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
        .single()

      if (!data) {
        notFound()
      }

      setPost(data)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  if (loading) {
    return (
      <div className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
        {tr.loading}
      </div>
    )
  }

  if (!post) return null

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
          {tr.back}
        </Link>
      </div>
      <div className="mb-8">
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>❯</span> vim {post.slug}.md
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>
          {tr.editPostTitle}
        </h1>
      </div>
      <PostForm post={post} lang={lang} />
    </div>
  )
}
