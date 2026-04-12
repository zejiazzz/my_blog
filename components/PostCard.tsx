import Link from 'next/link';
import { Post } from '@/lib/schema';

interface Props {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: Props) {
  const preview = post.excerpt || post.content.slice(0, 120) + (post.content.length > 120 ? '...' : '');
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-');

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article
        className="px-4 py-4 rounded-lg transition-all duration-150"
        style={{
          borderLeft: '2px solid transparent',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'var(--bg-card)';
          el.style.borderLeftColor = 'var(--accent)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'transparent';
          el.style.borderLeftColor = 'transparent';
        }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2
            className="font-medium text-sm leading-snug transition-colors"
            style={{ color: '#c9d1e0' }}
          >
            <span className="font-mono text-xs mr-2" style={{ color: 'var(--dim)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="group-hover:text-[#7aa2f7] transition-colors">{post.title}</span>
          </h2>
          <span
            className="font-mono text-xs shrink-0"
            style={{ color: 'var(--text-muted)' }}
          >
            {date}
          </span>
        </div>

        {preview && (
          <p className="mt-1.5 text-xs leading-relaxed pl-8 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {preview}
          </p>
        )}
      </article>
    </Link>
  );
}
