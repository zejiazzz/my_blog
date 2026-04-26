'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import SkillForm from '@/components/SkillForm'
import { t } from '@/lib/i18n'
import type { Skill } from '@/lib/types'
import type { Lang } from '@/lib/i18n'

function getLang(): Lang {
  if (typeof document === 'undefined') return 'zh'
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
  return (match?.[1] as Lang) || 'zh'
}

interface Props {
  params: Promise<{ id: string }>
}

export default function EditSkillPage({ params }: Props) {
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [lang] = useState<Lang>(() => getLang())
  const tr = t[lang].admin
  const supabase = createClient()

  useEffect(() => {
    params.then(async ({ id }) => {
      const { data } = await supabase
        .from('skills')
        .select('*')
        .eq('id', Number(id))
        .maybeSingle()

      setSkill(data ?? null)
      setLoading(false)
    }).catch(() => {
      setSkill(null)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  if (loading) {
    return (
      <div className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
        {tr.loading}
      </div>
    )
  }

  if (!skill) {
    return (
      <div>
        <div className="mb-8">
          <Link href="/admin/skills" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
            {tr.back}
          </Link>
        </div>

        <div className="empty-state" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{ color: 'var(--accent-red)' }}>!</span>
          <span>{tr.skillNotFound}</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/skills" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
          {tr.back}
        </Link>
      </div>
      <div className="mb-8">
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>❯</span> vim {skill.slug}.md
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>
          {tr.editSkillTitle}
        </h1>
      </div>
      <SkillForm skill={skill} lang={lang} />
    </div>
  )
}
