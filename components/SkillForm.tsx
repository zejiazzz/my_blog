'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { t, type Lang } from '@/lib/i18n'
import type { Skill } from '@/lib/types'
import MarkdownEditor from './MarkdownEditor'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function parseTags(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string') return []
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

interface SkillFormProps {
  skill?: Skill
  lang?: Lang
}

export default function SkillForm({ skill, lang = 'zh' }: SkillFormProps) {
  const [slug, setSlug] = useState(skill?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!skill?.slug)
  const [content, setContent] = useState(skill?.content ?? '')
  const [contentEn, setContentEn] = useState(skill?.content_en ?? '')
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
      title_en: (formData.get('title_en') as string).trim(),
      slug: (formData.get('slug') as string).trim(),
      summary: (formData.get('summary') as string) || null,
      summary_en: (formData.get('summary_en') as string) || null,
      content,
      content_en: contentEn,
      category: (formData.get('category') as string) || null,
      tags: parseTags(formData.get('tags')),
      sort_order: Number(formData.get('sort_order') || 0),
      published: formData.get('published') === 'on',
    }

    if (!data.content.trim()) {
      alert(tr.contentRequired)
      setLoading(false)
      return
    }

    try {
      if (skill) {
        const { error } = await supabase.from('skills').update(data).eq('id', skill.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('skills').insert(data)
        if (error) throw error
      }

      router.push('/admin/skills')
      router.refresh()
    } catch (error) {
      console.error('Error saving skill:', error)
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
        <label style={labelStyle}>{lang === 'zh' ? '标题' : 'Title'}</label>
        <input name="title" type="text" defaultValue={skill?.title ?? ''} onChange={handleTitleChange} required className="input-dark" />
      </div>

      <div className="editor-field">
        <label style={labelStyle}>{lang === 'zh' ? '英文标题' : 'English title'}</label>
        <input name="title_en" type="text" defaultValue={skill?.title_en ?? ''} className="input-dark" />
      </div>

      <div className="editor-field">
        <label style={labelStyle}>{lang === 'zh' ? '地址' : 'Slug'}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs select-none" style={{ color: 'var(--text-muted)' }}>
            /skills/
          </span>
          <input name="slug" type="text" value={slug} onChange={handleSlugChange} required className="input-dark" style={{ paddingLeft: '4.5rem' }} />
        </div>
      </div>

      <div className="editor-field">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label style={labelStyle}>{lang === 'zh' ? '分类' : 'Category'}</label>
            <input name="category" type="text" defaultValue={skill?.category ?? ''} className="input-dark" />
          </div>
          <div>
            <label style={labelStyle}>{lang === 'zh' ? '排序' : 'Sort order'}</label>
            <input name="sort_order" type="number" defaultValue={skill?.sort_order ?? 0} className="input-dark" />
          </div>
        </div>
      </div>

      <div className="editor-field">
        <label style={labelStyle}>{lang === 'zh' ? '标签' : 'Tags'} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>{lang === 'zh' ? '（逗号分隔）' : '(comma separated)'}</span></label>
        <input name="tags" type="text" defaultValue={skill?.tags.join(', ') ?? ''} className="input-dark" />
      </div>

      <div className="editor-field">
        <label style={labelStyle}>{lang === 'zh' ? '摘要' : 'Summary'}</label>
        <textarea name="summary" defaultValue={skill?.summary ?? ''} rows={3} className="input-dark" style={{ resize: 'vertical' }} />
      </div>

      <div className="editor-field">
        <label style={labelStyle}>{lang === 'zh' ? '英文摘要' : 'Summary (EN)'}</label>
        <textarea name="summary_en" defaultValue={skill?.summary_en ?? ''} rows={3} className="input-dark" style={{ resize: 'vertical' }} />
      </div>

      <div className="editor-field">
        <div className="editor-field-header">
          <label style={labelStyle}>{lang === 'zh' ? '正文' : 'Content'}</label>
          <span className="editor-field-tip">{tr.editorModes}</span>
        </div>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder={lang === 'zh' ? '写技能说明、步骤或示例...' : 'Write the skill notes, steps, or examples...'}
          lang={lang}
        />
      </div>

      <div className="editor-field">
        <div className="editor-field-header">
          <label style={labelStyle}>{lang === 'zh' ? '英文正文' : 'Content (EN)'}</label>
          <span className="editor-field-tip">{tr.editorModes}</span>
        </div>
        <MarkdownEditor
          value={contentEn}
          onChange={setContentEn}
          placeholder={lang === 'zh' ? '写英文说明...' : 'Write the English notes...'}
          lang={lang}
        />
      </div>

      <div className="editor-panel">
        <div className="flex items-center gap-3 pt-1">
          <input name="published" type="checkbox" id="published" defaultChecked={skill?.published ?? false} />
          <label htmlFor="published" className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {tr.publishLabel}
          </label>
        </div>
      </div>

      <div className="editor-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? tr.saving : skill ? tr.updateSkillBtn : tr.createSkillBtn}
        </button>
      </div>
    </form>
  )
}
