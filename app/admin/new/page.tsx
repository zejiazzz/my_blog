import Link from 'next/link'
import { cookies } from 'next/headers'
import PostForm from '@/components/PostForm'
import { t, type Lang } from '@/lib/i18n'

export default async function NewPostPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].admin

  return (
    <div className="admin-editor-page">
      <div className="mb-8">
        <Link href="/admin" className="back-link" style={{ marginBottom: 0 }}>
          {tr.back}
        </Link>
      </div>
      <div className="admin-page-hero">
        <span className="admin-eyebrow">{tr.editorEyebrow}</span>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
          {tr.newPostTitle}
        </h1>
        <p className="admin-page-copy">{tr.newPostDescription}</p>
      </div>
      <PostForm lang={lang} />
    </div>
  )
}
