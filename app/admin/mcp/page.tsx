'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

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
      .update({ content: contentZh, content_en: contentEn, updated_at: new Date().toISOString() })
      .eq('id', 1)

    setSaving(false)
    if (error) {
      alert(tr.saveFail)
    } else {
      router.push('/mcp')
    }
  }

  if (loading) {
    return <div className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{tr.loading}</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="mb-3">
            <Link href="/admin" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
              {tr.back}
            </Link>
          </div>
          <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-green)' }}>❯</span> vim ./mcp.md
          </p>
          <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>{tr.editMcpTitle}</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary font-mono">
          {saving ? tr.saving : tr.save}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            # 中文内容
          </label>
          <textarea
            value={contentZh}
            onChange={(e) => setContentZh(e.target.value)}
            placeholder="写 MCP 工具列表、配置说明..."
            rows={15}
            className="w-full font-mono text-sm p-4 rounded-lg resize-y"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', lineHeight: '1.7' }}
          />
        </div>
        <div>
          <label className="block font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            # English content
          </label>
          <textarea
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
            placeholder="Write MCP tools list, config notes..."
            rows={15}
            className="w-full font-mono text-sm p-4 rounded-lg resize-y"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', lineHeight: '1.7' }}
          />
        </div>
      </div>
    </div>
  )
}
