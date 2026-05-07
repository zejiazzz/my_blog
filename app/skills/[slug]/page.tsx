import { notFound } from 'next/navigation'
import { createClient as createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function SkillPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerClient()
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].skills

  const { data: skill } = await supabase
    .from('skills')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!skill) notFound()

  const title = lang === 'zh' ? skill.title : skill.title_en || skill.title
  const summary =
    lang === 'zh'
      ? skill.summary || skill.summary_en
      : skill.summary_en || skill.summary
  const content = lang === 'zh' ? skill.content : skill.content_en || skill.content

  return (
    <div className="page-shell page-shell--reading">
      <article className="article-page">
        <Link href="/skills" className="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {tr.back}
        </Link>

        <header className="article-header">
          <span className="page-eyebrow">{lang === 'zh' ? '技能条目' : 'Skill note'}</span>
          <h1 className="article-title">{title}</h1>
          <div className="article-meta">
            <span className="article-meta-dot" />
            {skill.category && <span>{skill.category}</span>}
            <span className="article-meta-separator">/</span>
            <span>{skill.slug}</span>
          </div>
          {summary && <p className="article-lead">{summary}</p>}
          {skill.tags.length > 0 && (
            <div className="tag-row">
              {(skill.tags as string[]).map((tag) => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div className="article-body">
          <MarkdownRenderer content={content} />
        </div>
      </article>
    </div>
  )
}
