'use client';

export function DeleteButton({ postId }: { postId: number }) {
  return (
    <button
      type="submit"
      className="font-mono text-xs transition-colors hover:underline"
      style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}
      onClick={(e) => {
        if (!confirm('Delete this post?')) e.preventDefault();
      }}
    >
      rm
    </button>
  );
}
