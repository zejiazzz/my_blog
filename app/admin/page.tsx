import Link from 'next/link';
import { getAllPosts, deletePost } from '@/lib/actions';
import { revalidatePath } from 'next/cache';
import { DeleteButton } from './delete-button';

export default async function AdminPage() {
  const posts = await getAllPosts();

  async function deletePostAction(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    await deletePost(id);
    revalidatePath('/admin');
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-green)' }}>❯</span> ls -la ./posts --all
          </p>
          <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>
            Admin
          </h1>
        </div>
        <Link href="/admin/new" className="btn-primary font-mono">
          + new post
        </Link>
      </div>

      {/* Posts table */}
      {posts.length === 0 ? (
        <div
          className="font-mono text-sm py-12 text-center rounded-lg"
          style={{
            color: 'var(--text-muted)',
            border: '1px dashed var(--border)',
          }}
        >
          <span style={{ color: 'var(--accent-red)' }}>!</span> No posts yet.
        </div>
      ) : (
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 font-mono text-xs"
            style={{
              background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <span>title</span>
            <span>status</span>
            <span>actions</span>
          </div>

          {/* Rows */}
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3.5"
              style={{
                background: i % 2 === 0 ? 'var(--bg-card)' : 'transparent',
                borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span className="text-sm font-medium truncate" style={{ color: '#c9d1e0' }}>
                <span className="font-mono text-xs mr-2" style={{ color: 'var(--dim)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {post.title}
              </span>

              <span
                className="font-mono text-xs px-2 py-0.5 rounded"
                style={
                  post.published
                    ? { background: 'rgba(158,206,106,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(158,206,106,0.2)' }
                    : { background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                }
              >
                {post.published ? '● live' : '○ draft'}
              </span>

              <div className="flex items-center gap-3 font-mono text-xs">
                <Link
                  href={`/admin/edit/${post.id}`}
                  style={{ color: 'var(--accent)' }}
                  className="hover:underline"
                >
                  edit
                </Link>
                <form action={deletePostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <DeleteButton postId={post.id} />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
