import Link from 'next/link'
import { cookies } from 'next/headers'
import SkillForm from '@/components/SkillForm'
import { t, type Lang } from '@/lib/i18n'

export default async function NewSkillPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].admin

  return (
    <div className="admin-editor-page">
      <div className="mb-8">
        <Link href="/admin/skills" className="back-link" style={{ marginBottom: 0 }}>
          {tr.back}
        </Link>
      </div>
      <div className="admin-page-hero">
        <span className="admin-eyebrow">Writing Studio</span>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
          {tr.newSkillTitle}
        </h1>
        <p className="admin-page-copy">Create a skill card and its long-form notes in one place.</p>
      </div>
      <SkillForm lang={lang} />
    </div>
  )
}
