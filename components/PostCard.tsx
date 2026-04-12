import Link from 'next/link';
import { Post } from '@/lib/actions';

export default function PostCard({ post }: { post: Post }) {
  const preview = post.excerpt || post.content.slice(0, 150) + (post.content.length > 150 ? '...' : '');
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-500 text-sm mb-3">{date}</p>
      <p className="text-gray-700 leading-relaxed">{preview}</p>
    </article>
  );
}
