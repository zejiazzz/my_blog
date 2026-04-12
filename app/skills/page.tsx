import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'

export const revalidate = 60

export default async function SkillsPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].skills

  const supabase = await createClient()
  const { data } = await supabase.from('skills_page').select('content, content_en').eq('id', 1).single()
  const content = lang === 'zh' ? (data?.content || '') : (data?.content_en || '')

  return (
    <div>
      <div className="mb-10">
        <Link
          href="/"
          className="font-mono text-xs transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <span style={{ color: 'var(--accent)' }}>{tr.back}</span>
        </Link>
      </div>

      <div className="mb-12">
        <p className="font-mono text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>{tr.cmd}</span>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#e2e8f8' }}>
          {tr.title}
        </h1>
      </div>

      {content ? (
        <div
          className="whitespace-pre-wrap text-sm leading-relaxed"
          style={{ color: 'var(--text)' }}
        >
          {content}
        </div>
      ) : (
        <div
          className="font-mono text-sm py-12 text-center"
          style={{ color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '8px' }}
        >
          <span style={{ color: 'var(--accent-red)' }}>!</span> {tr.empty}
        </div>
      )}
    </div>
  )
}
