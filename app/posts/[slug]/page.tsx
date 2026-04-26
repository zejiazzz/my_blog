import { notFound } from 'next/navigation'
import { createClient as createServerClient } from '@/lib/supabase-server'
import { supabaseGlobalOptions } from '@/lib/supabase-fetch'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: supabaseGlobalOptions,
    }
  )
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true)

  return posts?.map((post) => ({ slug: post.slug })) ?? []
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerClient()
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].post

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const date = new Date(post.created_at).toLocaleDateString(
    lang === 'zh' ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <article>
      <Link href="/" className="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        {tr.back}
      </Link>

      {/* Article header */}
      <header className="article-header">
        <h1 className="article-title">{post.title}</h1>
        <div className="article-meta">
          <span className="article-meta-dot" />
          <span>{date}</span>
          <span style={{ color: 'var(--text-dim)' }}>·</span>
          <span style={{ color: 'var(--text-muted)' }}>{post.slug}</span>
        </div>
      </header>

      {/* Content */}
      <div className="prose-content" style={{ whiteSpace: 'pre-wrap' }}>
        {post.content}
      </div>

      {/* Footer */}
      <footer className="article-footer">
        <span style={{ color: 'var(--text-dim)', fontSize: '0.6875rem' }}>EOF</span>
        <span style={{ color: 'var(--border)' }}>—</span>
        <Link href="/" className="back-link" style={{ margin: 0 }}>
          {tr.backToIndex}
        </Link>
      </footer>
    </article>
  )
}
