import Link from 'next/link'
import type { Post } from '@/lib/types'
import type { Lang } from '@/lib/i18n'

interface Props {
  post: Post
  index?: number
  lang: Lang
}

export default function PostCard({ post, index = 0, lang }: Props) {
  const previewSource = post.excerpt || post.content
  const preview = previewSource
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 120)
  const previewText = preview + (previewSource.length > 120 ? '…' : '')
  const readLabel = lang === 'zh' ? '阅读文章' : 'Read article'
  const publishedLabel = lang === 'zh' ? '发布时间' : 'Published'

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-')

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="post-card"
      style={{
        padding: '1.4rem 1.45rem',
        borderRadius: 18,
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg-card) 94%, white 6%), var(--bg-card))',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span
            className="post-card-meta"
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}
          >
            {`No. ${String(index + 1).padStart(2, '0')}`}
          </span>
          <span className="post-card-meta" style={{ fontSize: '0.75rem' }}>{date}</span>
        </div>

        <h2 className="post-card-title" style={{ fontSize: '1.08rem', lineHeight: 1.45 }}>
          {post.title}
        </h2>

        {previewText && (
          <p className="post-card-excerpt" style={{ marginTop: 0, fontSize: '0.92rem', lineHeight: 1.8 }}>
            {previewText}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '0.1rem',
          }}
        >
          <span className="post-card-meta" style={{ fontSize: '0.75rem' }}>
            {publishedLabel}
          </span>
          <span
            style={{
              fontSize: '0.82rem',
              color: 'var(--text)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {readLabel}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
