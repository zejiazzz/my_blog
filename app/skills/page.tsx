import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'
import SkillCard from '@/components/SkillCard'

export const revalidate = 60

export default async function SkillsPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].skills

  const supabase = await createClient()
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  const count = skills?.length ?? 0

  return (
    <div>
      <Link href="/" className="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        {tr.back}
      </Link>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">{tr.title}</h1>
        <p className="page-subtitle">
          {count} {lang === 'zh' ? '个技能' : count === 1 ? 'skill' : 'skills'}
        </p>
      </div>

      {count === 0 ? (
        <div className="empty-state">{tr.empty}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {skills!.map((skill, i) => (
            <SkillCard key={skill.id} skill={skill} index={i} lang={lang} />
          ))}
        </div>
      )}
    </div>
  )
}
