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
      excerpt: (formData.get('excerpt') as string) || null,
      published: formData.get('published') === 'on',
    });
    revalidatePath('/admin');
    revalidatePath('/');
    redirect('/admin');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">New Post</h1>
      <PostForm action={createPostAction} />
    </div>
  );
}
