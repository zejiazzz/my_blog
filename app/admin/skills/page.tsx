'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import type { Skill } from '@/lib/types'

function getLang(): Lang {
  if (typeof document === 'undefined') return 'zh'
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
  return (match?.[1] as Lang) || 'zh'
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [lang] = useState<Lang>(() => getLang())
  const tr = t[lang].admin

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setSkills(data || [])
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleDelete(id: number) {
    if (!confirm(tr.deleteConfirm)) return

    const supabase = createClient()
    const { error } = await supabase.from('skills').delete().eq('id', id)

    if (error) {
      alert(tr.deleteFail)
      return
    }

    setSkills(skills.filter((skill) => skill.id !== id))
  }

  if (loading) {
    return <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{tr.loading}</div>
  }

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div className="admin-page-hero" style={{ marginBottom: 0 }}>
          <div className="mb-3">
            <Link href="/admin" className="back-link" style={{ marginBottom: 0 }}>
              {tr.back}
            </Link>
          </div>
          <span className="admin-eyebrow">Writing Studio</span>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{tr.editSkillsTitle}</h1>
          <p className="admin-page-copy">Manage skill pages, metadata, and the long-form notes behind each card.</p>
        </div>
        <Link href="/admin/skills/new" className="btn-primary">
          {tr.newSkill}
        </Link>
      </div>

      {skills.length === 0 ? (
        <div className="empty-state">{t[lang].skills.empty}</div>
      ) : (
        <div className="admin-table">
          <div className="admin-table-head">
            <span>{tr.title}</span>
            <span>{tr.status}</span>
            <span>{tr.actions}</span>
          </div>

          {skills.map((skill, i) => (
            <div key={skill.id} className="admin-table-row" style={{ borderBottom: i < skills.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                {skill.title}
              </span>

              <span className="badge" style={skill.published ? { background: 'color-mix(in srgb, var(--accent-green) 14%, transparent)', color: 'var(--accent-green)' } : { background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                {skill.published ? tr.live : tr.draft}
              </span>

              <div className="admin-table-actions">
                <Link href={`/admin/skills/edit/${skill.id}`} style={{ color: 'var(--accent)' }} className="hover:underline">
                  {lang === 'zh' ? '编辑' : 'Edit'}
                </Link>
                <button onClick={() => handleDelete(skill.id)} className="transition-colors hover:underline" style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {lang === 'zh' ? '删除' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
