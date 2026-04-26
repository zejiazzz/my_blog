import Link from 'next/link'
import { cookies } from 'next/headers'
import SkillForm from '@/components/SkillForm'
import { t, type Lang } from '@/lib/i18n'

export default async function NewSkillPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].admin

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/skills" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
          {tr.back}
        </Link>
      </div>
      <div className="mb-8">
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>❯</span> touch new-skill.md
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>
          {tr.newSkillTitle}
        </h1>
      </div>
      <SkillForm lang={lang} />
    </div>
  )
}
