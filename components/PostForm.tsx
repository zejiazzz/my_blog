'use client';

import { useState } from 'react';
import { Post } from '@/lib/schema';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface PostFormProps {
  post?: Post;
  action: (formData: FormData) => Promise<void>;
}

export default function PostForm({ post, action }: PostFormProps) {
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post?.slug);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugManuallyEdited) {
      setSlug(slugify(e.target.value));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManuallyEdited(true);
    setSlug(e.target.value);
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          name="title"
          type="text"
          defaultValue={post?.title ?? ''}
          onChange={handleTitleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input
          name="slug"
          type="text"
          value={slug}
          onChange={handleSlugChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          name="content"
          defaultValue={post?.content ?? ''}
          required
          rows={16}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt ?? ''}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          name="published"
          type="checkbox"
          id="published"
          defaultChecked={post?.published ?? false}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Published
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Save
      </button>
    </form>
  );
}
