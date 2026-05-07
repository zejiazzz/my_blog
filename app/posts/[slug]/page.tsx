import { notFound } from 'next/navigation'
import { createClient as createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
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
        {post.excerpt && <p className="article-lead">{post.excerpt}</p>}
        <div className="article-meta">
          <span className="article-meta-dot" />
          <span>{date}</span>
        </div>
      </header>

      <MarkdownRenderer content={post.content} />

      <footer className="article-footer">
        <Link href="/" className="back-link" style={{ margin: 0 }}>
          {tr.backToIndex}
        </Link>
      </footer>
    </article>
  )
}
