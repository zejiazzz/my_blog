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

  const labelStyle = {
    display: 'block',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    marginBottom: '0.4rem',
  };

  return (
    <form action={action} className="space-y-6">

      <div>
        <label style={labelStyle}># title:</label>
        <input
          name="title"
          type="text"
          defaultValue={post?.title ?? ''}
          onChange={handleTitleChange}
          required
          placeholder="My awesome post"
          className="input-dark"
        />
      </div>

      <div>
        <label style={labelStyle}># slug:</label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs select-none"
            style={{ color: 'var(--text-muted)' }}
          >
            /posts/
          </span>
          <input
            name="slug"
            type="text"
            value={slug}
            onChange={handleSlugChange}
            required
            placeholder="my-awesome-post"
            className="input-dark font-mono"
            style={{ paddingLeft: '4.25rem' }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}># content:</label>
        <textarea
          name="content"
          defaultValue={post?.content ?? ''}
          required
          rows={18}
          placeholder="Write your post here..."
          className="input-dark font-mono"
          style={{ resize: 'vertical', lineHeight: '1.7' }}
        />
      </div>

      <div>
        <label style={labelStyle}># excerpt: <span style={{ color: 'var(--dim)' }}>(optional)</span></label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt ?? ''}
          rows={3}
          placeholder="Short description shown in post list..."
          className="input-dark"
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="relative">
          <input
            name="published"
            type="checkbox"
            id="published"
            defaultChecked={post?.published ?? false}
            className="sr-only peer"
          />
          <label
            htmlFor="published"
            className="flex items-center gap-2 cursor-pointer select-none font-mono text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <span
              className="w-8 h-4 rounded-full flex items-center px-0.5 transition-colors peer-checked:bg-[var(--accent)] peer-checked:bg-opacity-80"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <span className="w-3 h-3 rounded-full bg-current transition-transform peer-checked:translate-x-4" />
            </span>
            publish immediately
          </label>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <button type="submit" className="btn-primary font-mono">
          {post ? '→ update post' : '→ create post'}
        </button>
      </div>
    </form>
  );
}
