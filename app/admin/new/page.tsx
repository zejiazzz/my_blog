import Link from 'next/link'
import { cookies } from 'next/headers'
import PostForm from '@/components/PostForm'
import { t, type Lang } from '@/lib/i18n'

export default async function NewPostPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].admin

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
          {tr.back}
        </Link>
      </div>
      <div className="mb-8">
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>❯</span> touch new-post.md
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f8' }}>
          {tr.newPostTitle}
        </h1>
      </div>
      <PostForm lang={lang} />
    </div>
  )
}
