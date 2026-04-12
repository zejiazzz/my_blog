import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createPost } from '@/lib/actions';
import PostForm from '@/components/PostForm';

export default function NewPostPage() {
  async function createPostAction(formData: FormData) {
    'use server';
    await createPost({
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: (formData.get('excerpt') as string) || undefined,
      published: formData.get('published') === 'on',
    });
    revalidatePath('/admin');
    revalidatePath('/');
    redirect('/admin');
  }

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>❯</span> touch new-post.md
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>New Post</h1>
      </div>
      <PostForm action={createPostAction} />
    </div>
  );
}
