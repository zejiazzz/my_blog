import Link from 'next/link'
import { cookies } from 'next/headers'
import LangSwitcher from './LangSwitcher'
import ThemeToggle from './ThemeToggle'
import { t, type Lang } from '@/lib/i18n'

export default async function Nav() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const nav = t[lang].nav
  const hasAuthCookie = cookieStore
    .getAll()
    .some((cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token'))

  return (
    <nav className="nav-root">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <span className="nav-logo-dot" />
          <span>~/blog</span>
          <span className="cursor-blink" />
        </Link>

        {/* Right side */}
        <div className="nav-links">
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

          <span style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 6px', flexShrink: 0 }} />

          <LangSwitcher current={lang} />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
