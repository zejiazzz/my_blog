import Link from 'next/link'
import type { Post } from '@/lib/types'
import type { Lang } from '@/lib/i18n'

interface Props {
  post: Post
  index?: number
  lang: Lang
  compact?: boolean
}

export default function PostCard({ post, index = 0, lang, compact = false }: Props) {
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
  const sequenceLabel = compact
    ? (lang === 'zh' ? '最新文章' : 'Latest entry')
    : `No. ${String(index + 1).padStart(2, '0')}`

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-')

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={compact ? 'post-card post-card--compact' : 'post-card'}
    >
      <div className="post-card-index" aria-hidden="true">
        <span className="post-card-index-label">
          {compact ? (lang === 'zh' ? '最新' : 'Now') : `No. ${String(index + 1).padStart(2, '0')}`}
        </span>
      </div>

      <div className="post-card-body">
        <div className="post-card-header">
          <span className="post-card-kicker">
            {sequenceLabel}
          </span>
          <span className="post-card-meta">{date}</span>
        </div>

        <h2 className="post-card-title">
          {post.title}
        </h2>

        {previewText && (
          <p className="post-card-excerpt">
            {previewText}
          </p>
        )}

        <div className="post-card-footer">
          <span className="post-card-meta">
            {publishedLabel}
          </span>
          <span className="post-card-cta">
            {readLabel}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
