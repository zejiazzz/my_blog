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
      excerpt: (formData.get('excerpt') as string) || null,
      published: formData.get('published') === 'on',
    });
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/posts/${formData.get('slug')}`);
    redirect('/admin');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Edit Post</h1>
      <PostForm post={post} action={updatePostAction} />
    </div>
  );
}
