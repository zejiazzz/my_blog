import { getAllPosts } from '@/lib/actions';
import PostCard from '@/components/PostCard';

export default async function HomePage() {
  const posts = await getAllPosts(true);

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>❯</span> ls -la ./posts
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#e2e8f8' }}>
          Writing
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          {posts.length} {posts.length === 1 ? 'entry' : 'entries'} found
        </p>
      </div>

      {posts.length === 0 ? (
        <div
          className="font-mono text-sm py-12 text-center"
          style={{ color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '8px' }}
        >
          <span style={{ color: 'var(--accent-red)' }}>!</span> No posts yet.
        </div>
      ) : (
        <div className="space-y-1">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
