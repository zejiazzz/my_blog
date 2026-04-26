import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import PostCard from '@/components/PostCard'
import { t, type Lang } from '@/lib/i18n'

export default async function HomePage() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const tr = t[lang].home

  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const count = posts?.length ?? 0

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">{tr.title}</h1>
        <p className="page-subtitle">
          {count} {lang === 'zh' ? '篇文章' : count === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      {/* List */}
      {count === 0 ? (
        <div className="empty-state">{tr.empty}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {posts!.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
