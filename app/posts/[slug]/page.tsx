import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/actions';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts(true);
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-8">{date}</p>
      <div className="prose prose-gray max-w-none whitespace-pre-wrap leading-relaxed text-gray-800">
        {post.content}
      </div>
    </article>
  );
}
