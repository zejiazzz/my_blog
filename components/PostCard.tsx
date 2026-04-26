import Link from 'next/link'
import type { Post } from '@/lib/types'

interface Props {
  post: Post
  index?: number
}

export default function PostCard({ post, index = 0 }: Props) {
  const preview =
    post.excerpt || post.content.slice(0, 120) + (post.content.length > 120 ? '…' : '')

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-')

  return (
    <Link href={`/posts/${post.slug}`} className="post-card">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
        <h2 className="post-card-title">
          <span className="post-card-meta" style={{ marginRight: '0.625rem' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          {post.title}
        </h2>
        <span className="post-card-meta">{date}</span>
      </div>

      {preview && <p className="post-card-excerpt">{preview}</p>}
    </Link>
  )
}
