import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export const revalidate = 60

export default async function AboutPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].about

  const supabase = await createClient()
  const { data } = await supabase
    .from('about_page')
    .select('content, content_en')
    .eq('id', 1)
    .single()

  const content = lang === 'zh' ? (data?.content || '') : (data?.content_en || '')

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
      </div>

      {content ? (
        <MarkdownRenderer content={content} />
      ) : (
        <div className="empty-state">{tr.empty}</div>
      )}
    </div>
  )
}
