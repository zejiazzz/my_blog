import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export const revalidate = 60

export default async function McpPage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].mcp
  const eyebrow = lang === 'zh' ? '工具手册' : 'Reference'

  const supabase = await createClient()
  const { data } = await supabase.from('mcp_page').select('content, content_en').eq('id', 1).single()
  const content = lang === 'zh' ? (data?.content || '') : (data?.content_en || '')

  return (
    <div>
      <div className="mb-10">
        <Link href="/" className="back-link" style={{ marginBottom: 0 }}>
          {tr.back}
        </Link>
      </div>

      <div className="mb-12">
        <span className="page-eyebrow">{eyebrow}</span>
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
