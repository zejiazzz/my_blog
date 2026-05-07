import Link from 'next/link'
import { cookies } from 'next/headers'
import PostForm from '@/components/PostForm'
import { t, type Lang } from '@/lib/i18n'

export default async function NewPostPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].admin

  return (
    <div className="page-shell page-shell--editor">
      <div className="admin-editor-page">
        <div>
          <Link href="/admin" className="back-link back-link--inline">
            {tr.back}
          </Link>
        </div>
        <div className="admin-page-hero">
          <span className="admin-eyebrow">{tr.editorEyebrow}</span>
          <h1 className="page-title page-title--admin">
            {tr.newPostTitle}
          </h1>
          <p className="admin-page-copy">{tr.newPostDescription}</p>
        </div>
        <PostForm lang={lang} />
      </div>
    </div>
  )
}
