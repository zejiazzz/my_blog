import Link from 'next/link'
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
  const latestPost = posts?.[0] ?? null

  return (
    <div className="page-shell page-shell--home home-shell">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="page-eyebrow">{collectionLabel}</span>
          <h1 className="page-title">{tr.title}</h1>
          <p className="home-intro">{intro}</p>
          <div className="home-stat-row">
            <span className="home-stat">{countLabel}</span>
            <span className="home-stat-note">
              {lang === 'zh' ? '按时间倒序整理，优先服务连续阅读。' : 'Ordered by date and tuned for sustained reading.'}
            </span>
          </div>
        </div>

        <aside className="home-feature-card">
          <span className="home-feature-label">
            {lang === 'zh' ? '最新入口' : 'Latest note'}
          </span>
          {latestPost ? (
            <>
              <h2 className="home-feature-title">{latestPost.title}</h2>
              <p className="home-feature-excerpt">
                {(latestPost.excerpt || latestPost.content)
                  .replace(/^#{1,6}\s+/gm, '')
                  .replace(/[*_`]/g, '')
                  .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
                  .replace(/\n+/g, ' ')
                  .trim()
                  .slice(0, 120)}
                …
              </p>
              <Link href={`/posts/${latestPost.slug}`} className="btn-ghost home-feature-link">
                {lang === 'zh' ? '进入正文' : 'Open essay'}
              </Link>
            </>
          ) : (
            <div className="empty-state empty-state--soft">{tr.empty}</div>
          )}
        </aside>
      </section>

      <section className="home-index">
        <div className="home-index-heading">
          <div>
            <p className="home-index-label">{lang === 'zh' ? '文章索引' : 'Index'}</p>
            <h2 className="home-index-title">{collectionLabel}</h2>
          </div>
          <p className="home-index-note">
            {lang === 'zh' ? '标题优先，摘要适度，保留进入正文前的判断空间。' : 'Title first, enough summary, and a clear path into the full piece.'}
          </p>
        </div>

        {count === 0 ? (
          <div className="empty-state">{tr.empty}</div>
        ) : (
          <div className="post-list">
            {posts!.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} lang={lang} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
