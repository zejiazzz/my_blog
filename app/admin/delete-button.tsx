'use client';

export function DeleteButton({ postId }: { postId: number }) {
  return (
    <button
      type="submit"
      className="text-red-600 hover:underline"
      onClick={(e) => {
        if (!confirm('Delete this post?')) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
