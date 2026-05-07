import Link from 'next/link'
import { cookies } from 'next/headers'
import SkillForm from '@/components/SkillForm'
import { t, type Lang } from '@/lib/i18n'

export default async function NewSkillPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].admin

  return (
    <div className="page-shell page-shell--editor">
      <div className="admin-editor-page">
        <div>
          <Link href="/admin/skills" className="back-link back-link--inline">
            {tr.back}
          </Link>
        </div>
        <div className="admin-page-hero">
          <span className="admin-eyebrow">Writing Studio</span>
          <h1 className="page-title page-title--admin">
            {tr.newSkillTitle}
          </h1>
          <p className="admin-page-copy">Create a skill card and its long-form notes in one place.</p>
        </div>
        <SkillForm lang={lang} />
      </div>
    </div>
  )
}
