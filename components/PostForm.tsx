'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { t, type Lang } from '@/lib/i18n'
import type { Post } from '@/lib/types'
import MarkdownEditor from './MarkdownEditor'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

interface PostFormProps {
  post?: Post
  lang?: Lang
}

export default function PostForm({ post, lang = 'zh' }: PostFormProps) {
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post?.slug)
  const [content, setContent] = useState(post?.content ?? '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const tr = t[lang].admin

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugManuallyEdited) {
      setSlug(slugify(e.target.value))
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManuallyEdited(true)
    setSlug(e.target.value)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: (formData.get('title') as string).trim(),
      slug: (formData.get('slug') as string).trim(),
      content,
      excerpt: (formData.get('excerpt') as string) || null,
      published: formData.get('published') === 'on',
    }

    if (!data.content.trim()) {
      alert(tr.contentRequired)
      setLoading(false)
      return
    }

    try {
      if (post) {
        const { error } = await supabase
          .from('posts')
          .update(data)
          .eq('id', post.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('posts').insert(data)
        if (error) throw error
      }

      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Error saving post:', error)
      alert(tr.saveFail)
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '0.55rem',
    letterSpacing: '-0.01em',
  }

  return (
    <form onSubmit={handleSubmit} className="editor-form">
      <div className="editor-field">
        <label style={labelStyle}>{tr.formTitle}</label>
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

      <div className="editor-field">
        <label style={labelStyle}>{tr.formSlug}</label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs select-none"
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
            className="input-dark"
            style={{ paddingLeft: '4.25rem' }}
          />
        </div>
      </div>

      <div className="editor-field">
        <div className="editor-field-header">
          <label style={labelStyle}>{tr.formContent}</label>
          <span className="editor-field-tip">{tr.editorModes}</span>
        </div>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder={tr.editorPlaceholder}
        />
        <p className="editor-helper-text">
          {tr.editorHint}
        </p>
      </div>

      <div className="editor-field">
        <label style={labelStyle}>
          {tr.formExcerpt}{' '}
          <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>{tr.optional}</span>
        </label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt ?? ''}
          rows={3}
          placeholder="Short description shown in post list..."
          className="input-dark"
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="editor-panel">
        <div className="editor-field-header">
          <span style={labelStyle}>{tr.formPublish}</span>
          <span className="editor-field-tip">{tr.publishHelp}</span>
        </div>
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
            className="flex items-center gap-2 cursor-pointer select-none text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <span
              className="w-8 h-4 rounded-full flex items-center px-0.5 transition-colors peer-checked:bg-[var(--accent)] peer-checked:bg-opacity-80"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <span className="w-3 h-3 rounded-full bg-current transition-transform peer-checked:translate-x-4" />
            </span>
            {tr.publishLabel}
          </label>
        </div>
      </div>

      <div className="editor-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? tr.saving : post ? tr.updateBtn : tr.createBtn}
        </button>
        <span className="editor-field-tip">{tr.saveFormat}</span>
      </div>
    </form>
  )
}
