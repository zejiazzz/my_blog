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

  return (
    <form onSubmit={handleSubmit} className="editor-form editor-workbench">
      <div className="editor-main-column">
        <div className="editor-field">
          <label className="field-label">{tr.formTitle}</label>
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

        <div className="editor-field editor-field--editor">
          <div className="editor-field-header">
            <label className="field-label">{tr.formContent}</label>
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
      </div>

      <aside className="editor-side-column">
        <div className="editor-field">
          <label className="field-label">{tr.formSlug}</label>
          <div className="editor-slug-input">
            <span className="editor-slug-prefix">/posts/</span>
            <input
              name="slug"
              type="text"
              value={slug}
              onChange={handleSlugChange}
              required
              placeholder="my-awesome-post"
              className="input-dark editor-slug-control"
            />
          </div>
        </div>

        <div className="editor-field">
          <label className="field-label">
            {tr.formExcerpt}{' '}
            <span className="field-label-note">{tr.optional}</span>
          </label>
          <textarea
            name="excerpt"
            defaultValue={post?.excerpt ?? ''}
            rows={5}
            placeholder="Short description shown in post list..."
            className="input-dark"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="editor-panel editor-panel--sticky">
          <div className="editor-field-header">
            <span className="field-label field-label--compact">{tr.formPublish}</span>
            <span className="editor-field-tip">{tr.publishHelp}</span>
          </div>
          <div className="editor-publish-toggle">
            <input
              name="published"
              type="checkbox"
              id="published"
              defaultChecked={post?.published ?? false}
              className="sr-only peer"
            />
            <label
              htmlFor="published"
              className="editor-publish-label"
            >
              <span className="editor-publish-switch">
                <span className="editor-publish-knob" />
              </span>
              {tr.publishLabel}
            </label>
          </div>

          <div className="editor-actions editor-actions--stack">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? tr.saving : post ? tr.updateBtn : tr.createBtn}
            </button>
            <span className="editor-field-tip">{tr.saveFormat}</span>
          </div>
        </div>
      </aside>
    </form>
  )
}
