import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getPostById, updatePost } from '@/lib/actions';
import PostForm from '@/components/PostForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) notFound();

  async function updatePostAction(formData: FormData) {
    'use server';
    await updatePost(Number(id), {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: (formData.get('excerpt') as string) || undefined,
      published: formData.get('published') === 'on',
    });
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/posts/${formData.get('slug')}`);
    redirect('/admin');
  }

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>❯</span> vim {post.slug}.md
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>Edit Post</h1>
      </div>
      <PostForm post={post} action={updatePostAction} />
    </div>
  );
}
