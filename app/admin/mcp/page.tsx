'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import MarkdownEditor from '@/components/MarkdownEditor'

function getLang(): Lang {
  if (typeof document === 'undefined') return 'zh'
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
  return (match?.[1] as Lang) || 'zh'
}

export default function AdminMcpPage() {
  const [contentZh, setContentZh] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lang] = useState<Lang>(() => getLang())
  const tr = t[lang].admin
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('mcp_page')
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
      .from('mcp_page')
      .upsert(
        { id: 1, content: contentZh, content_en: contentEn, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )

    setSaving(false)
    if (error) {
      alert(tr.saveFail)
    } else {
      router.push('/mcp')
    }
  }

  if (loading) {
    return <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{tr.loading}</div>
  }

  return (
    <div className="admin-editor-page">
      <div className="mb-8">
        <Link href="/admin" className="back-link" style={{ marginBottom: 0 }}>
          {tr.back}
        </Link>
      </div>
      <div className="admin-page-hero">
        <span className="admin-eyebrow">Writing Studio</span>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{tr.editMcpTitle}</h1>
        <p className="admin-page-copy">Keep the tool notes focused, discoverable, and easy to scan.</p>
      </div>
      <div className="editor-actions" style={{ justifyContent: 'flex-end' }}>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? tr.saving : tr.save}
        </button>
      </div>

      <div className="space-y-6">
        <div className="editor-field">
          <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            中文内容
          </label>
          <MarkdownEditor
            value={contentZh}
            onChange={setContentZh}
            placeholder="写 MCP 工具列表、配置说明..."
          />
        </div>
        <div className="editor-field">
          <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            English content
          </label>
          <MarkdownEditor
            value={contentEn}
            onChange={setContentEn}
            placeholder="Write MCP tools list, config notes..."
          />
        </div>
      </div>
    </div>
  )
}
