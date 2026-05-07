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
        <Link href="/" className="nav-logo">
          <span aria-hidden="true" className="nav-logo-mark">
            ≡
          </span>
          <span className="nav-logo-copy">
            <span className="nav-logo-title">{brandLabel}</span>
            <span className="nav-logo-overline">{brandMeta}</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link href="/" className="nav-link">{nav.posts}</Link>
          <Link href="/about" className="nav-link">{nav.about}</Link>
          <Link href="/skills" className="nav-link">{nav.skills}</Link>
          <Link href="/mcp" className="nav-link">{nav.mcp}</Link>
          <Link href="/admin" className="nav-link">{nav.admin}</Link>
          <span aria-hidden="true" className="nav-divider" />
          <div className="nav-utilities">
            {hasAuthCookie && (
              <form action="/api/logout" method="post" className="shrink-0">
                <button type="submit" className="nav-action-btn">
                  {nav.logout}
                </button>
              </form>
            )}

            <LangSwitcher current={lang} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
