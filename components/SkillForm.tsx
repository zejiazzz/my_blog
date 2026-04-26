'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { t, type Lang } from '@/lib/i18n'
import type { Skill } from '@/lib/types'

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
      title: formData.get('title') as string,
      title_en: (formData.get('title_en') as string) || '',
      slug: formData.get('slug') as string,
      summary: (formData.get('summary') as string) || null,
      summary_en: (formData.get('summary_en') as string) || null,
      content: formData.get('content') as string,
      content_en: (formData.get('content_en') as string) || '',
      category: (formData.get('category') as string) || null,
      tags: parseTags(formData.get('tags')),
      sort_order: Number(formData.get('sort_order') || 0),
      published: formData.get('published') === 'on',
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
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    marginBottom: '0.4rem',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label style={labelStyle}># title:</label>
        <input name="title" type="text" defaultValue={skill?.title ?? ''} onChange={handleTitleChange} required className="input-dark" />
      </div>

      <div>
        <label style={labelStyle}># title_en:</label>
        <input name="title_en" type="text" defaultValue={skill?.title_en ?? ''} className="input-dark" />
      </div>

      <div>
        <label style={labelStyle}># slug:</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs select-none" style={{ color: 'var(--text-muted)' }}>
            /skills/
          </span>
          <input name="slug" type="text" value={slug} onChange={handleSlugChange} required className="input-dark font-mono" style={{ paddingLeft: '4.5rem' }} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label style={labelStyle}># category:</label>
          <input name="category" type="text" defaultValue={skill?.category ?? ''} className="input-dark" />
        </div>
        <div>
          <label style={labelStyle}># sort_order:</label>
          <input name="sort_order" type="number" defaultValue={skill?.sort_order ?? 0} className="input-dark" />
        </div>
      </div>

      <div>
        <label style={labelStyle}># tags: <span style={{ color: 'var(--dim)' }}>(comma separated)</span></label>
        <input name="tags" type="text" defaultValue={skill?.tags.join(', ') ?? ''} className="input-dark" />
      </div>

      <div>
        <label style={labelStyle}># summary:</label>
        <textarea name="summary" defaultValue={skill?.summary ?? ''} rows={3} className="input-dark" style={{ resize: 'vertical' }} />
      </div>

      <div>
        <label style={labelStyle}># summary_en:</label>
        <textarea name="summary_en" defaultValue={skill?.summary_en ?? ''} rows={3} className="input-dark" style={{ resize: 'vertical' }} />
      </div>

      <div>
        <label style={labelStyle}># content:</label>
        <textarea name="content" defaultValue={skill?.content ?? ''} required rows={16} className="input-dark font-mono" style={{ resize: 'vertical', lineHeight: '1.7' }} />
      </div>

      <div>
        <label style={labelStyle}># content_en:</label>
        <textarea name="content_en" defaultValue={skill?.content_en ?? ''} rows={16} className="input-dark font-mono" style={{ resize: 'vertical', lineHeight: '1.7' }} />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <input name="published" type="checkbox" id="published" defaultChecked={skill?.published ?? false} />
        <label htmlFor="published" className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {tr.publishLabel}
        </label>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <button type="submit" disabled={loading} className="btn-primary font-mono">
          {loading ? tr.saving : skill ? tr.updateSkillBtn : tr.createSkillBtn}
        </button>
      </div>
    </form>
  )
}
