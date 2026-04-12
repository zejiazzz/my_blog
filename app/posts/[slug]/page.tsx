import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true)

  return posts?.map((post) => ({ slug: post.slug })) || []
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article>
      {/* Back */}
      <div className="mb-10">
        <Link
          href="/"
          className="font-mono text-xs transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <span style={{ color: 'var(--accent)' }}>←</span> cd ..
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <h1
          className="text-2xl font-semibold leading-tight mb-4"
          style={{ color: '#e2e8f8' }}
        >
          {post.title}
        </h1>
        <div className="flex items-center gap-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>●</span>
          <span>{date}</span>
          <span style={{ color: 'var(--dim)' }}>·</span>
          <span style={{ color: 'var(--dim)' }}>{post.slug}</span>
        </div>
      </header>

      {/* Content */}
      <div className="prose-dark whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Footer */}
      <div
        className="mt-16 pt-8 font-mono text-xs flex items-center gap-2"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
      >
        <span style={{ color: 'var(--dim)' }}>EOF</span>
        <span style={{ color: 'var(--border-bright)' }}>—</span>
        <Link
          href="/"
          style={{ color: 'var(--text-muted)' }}
          className="hover:text-[var(--accent)] transition-colors"
        >
          back to index
        </Link>
      </div>
    </article>
  )
}
