import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import PostCard from '@/components/PostCard'
import { t, type Lang } from '@/lib/i18n'

export default async function HomePage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].home
  const intro = lang === 'zh'
    ? '面向连续阅读整理文章、经验与阶段性思考，保留清晰结构，也留一点呼吸感。'
    : 'A quieter front door for essays, notes, and ongoing ideas, designed for reading instead of scanning.'
  const collectionLabel = lang === 'zh' ? '最新文章' : 'Latest writing'

  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const count = posts?.length ?? 0
  const countLabel = lang === 'zh' ? `${count} 篇文章` : `${count} ${count === 1 ? 'entry' : 'entries'}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        style={{
          marginBottom: '0.25rem',
          padding: '0.5rem 0 0.25rem',
          borderBottom: '1px solid color-mix(in srgb, var(--border) 72%, transparent)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.32rem 0.68rem',
            borderRadius: 999,
            background: 'color-mix(in srgb, var(--bg-elevated) 86%, transparent)',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          {collectionLabel}
        </span>
        <h1 className="page-title">{tr.title}</h1>
        <p className="page-subtitle" style={{ marginTop: '0.75rem', maxWidth: 560, fontSize: '0.98rem', lineHeight: 1.85, color: 'var(--text-secondary)' }}>
          {intro}
        </p>
        <p className="page-subtitle" style={{ marginTop: '1rem', fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {countLabel}
        </p>
      </div>

      {count === 0 ? (
        <div
          className="empty-state"
          style={{
            borderStyle: 'solid',
            borderRadius: 20,
            background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg-card) 92%, transparent), transparent)',
          }}
        >
          {tr.empty}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts!.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} lang={lang} />
          ))}
        </div>
      )}
    </div>
  )
}
