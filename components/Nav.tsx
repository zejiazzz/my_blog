import Link from 'next/link'
import { cookies } from 'next/headers'
import LangSwitcher from './LangSwitcher'
import ThemeToggle from './ThemeToggle'
import { t, type Lang } from '@/lib/i18n'

export default async function Nav() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const nav = t[lang].nav
  const brandLabel = lang === 'zh' ? '阅读札记' : 'Reading Notes'
  const brandMeta = lang === 'zh' ? '随笔与文章' : 'Essays and articles'
  const hasAuthCookie = cookieStore
    .getAll()
    .some((cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token'))

  return (
    <nav className="nav-root">
      <div className="nav-inner">
        <Link
          href="/"
          className="nav-logo"
          style={{
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: 'color-mix(in srgb, var(--accent) 16%, var(--bg-elevated))',
              border: '1px solid color-mix(in srgb, var(--accent) 20%, var(--border))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              color: 'var(--accent)',
              flexShrink: 0,
            }}
          >
            ≡
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 1, lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
              {brandLabel}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {brandMeta}
            </span>
          </span>
        </Link>

        <div className="nav-links" style={{ gap: '0.25rem' }}>
          <Link href="/" className="nav-link">{nav.posts}</Link>
          <Link href="/about" className="nav-link">{nav.about}</Link>
          <Link href="/skills" className="nav-link">{nav.skills}</Link>
          <Link href="/mcp" className="nav-link">{nav.mcp}</Link>
          <Link href="/admin" className="nav-link">{nav.admin}</Link>
          {hasAuthCookie && (
            <form action="/api/logout" method="post" className="shrink-0">
              <button type="submit" className="nav-action-btn">
                {nav.logout}
              </button>
            </form>
          )}

          <span
            aria-hidden="true"
            style={{
              width: 1,
              height: 18,
              background: 'color-mix(in srgb, var(--border) 80%, transparent)',
              margin: '0 8px',
              flexShrink: 0,
            }}
          />

          <LangSwitcher current={lang} />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
