'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import PostForm from '@/components/PostForm'
import type { Post } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: Props) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
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
        Loading...
      </div>
    )
  }

  if (!post) return null

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>❯</span> vim {post.slug}.md
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>
          Edit Post
        </h1>
      </div>
      <PostForm post={post} />
    </div>
  )
}
