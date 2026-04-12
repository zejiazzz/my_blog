import Link from 'next/link'
import PostForm from '@/components/PostForm'

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
          ← back
        </Link>
      </div>
      <div className="mb-8">
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>❯</span> touch new-post.md
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>
          New Post
        </h1>
      </div>
      <PostForm />
    </div>
  )
}
