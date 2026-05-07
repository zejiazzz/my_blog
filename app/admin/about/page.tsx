'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import MarkdownEditor from '@/components/MarkdownEditor'

export default function AdminAboutPage() {
  const [contentZh, setContentZh] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('about_page')
      .select('content, content_en')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        setContentZh(data?.content || '')
        setContentEn(data?.content_en || '')
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('about_page')
      .upsert(
        { id: 1, content: contentZh, content_en: contentEn, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )

    setSaving(false)
    if (error) {
      alert('Failed to save')
    } else {
      router.push('/about')
    }
  }

  if (loading) {
    return <div className="page-shell page-shell--editor text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</div>
  }

  return (
    <div className="page-shell page-shell--editor">
      <div className="admin-editor-page">
        <div>
          <Link href="/admin" className="back-link back-link--inline">
            ← back
          </Link>
        </div>
        <div className="admin-page-hero">
          <span className="admin-eyebrow">Writing Studio</span>
          <h1 className="page-title page-title--admin">Edit About</h1>
          <p className="admin-page-copy">Keep the biography page concise, readable, and easy to update.</p>
        </div>
        <div className="editor-actions editor-actions--end">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'saving...' : 'save'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="editor-field">
            <label className="field-label">
              中文内容
            </label>
            <MarkdownEditor
              value={contentZh}
              onChange={setContentZh}
              placeholder="写中文简介 / 简历..."
            />
          </div>

          <div className="editor-field">
            <label className="field-label">
              English content
            </label>
            <MarkdownEditor
              value={contentEn}
              onChange={setContentEn}
              placeholder="Write English bio / resume..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
