import Link from 'next/link'
import { cookies } from 'next/headers'
import LangSwitcher from './LangSwitcher'
import { t, type Lang } from '@/lib/i18n'

export default async function Nav() {
  const cookieStore = await cookies()
  const lang: Lang = (cookieStore.get('lang')?.value as Lang) || 'zh'
  const nav = t[lang].nav

  return (
    <nav
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 nav-logo">
          <span className="font-mono text-sm select-none nav-logo-text">
            ~/blog
          </span>
          <span className="inline-block w-2 h-[0.9em] cursor-blink align-middle" />
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/" className="nav-link font-mono text-xs px-3 py-1.5 rounded">
            {nav.posts}
          </Link>
          <Link href="/about" className="nav-link font-mono text-xs px-3 py-1.5 rounded">
            {nav.about}
          </Link>
          <Link href="/skills" className="nav-link font-mono text-xs px-3 py-1.5 rounded">
            {nav.skills}
          </Link>
          <Link href="/mcp" className="nav-link font-mono text-xs px-3 py-1.5 rounded">
            {nav.mcp}
          </Link>
          <Link href="/admin" className="nav-link font-mono text-xs px-3 py-1.5 rounded">
            {nav.admin}
          </Link>
          <LangSwitcher current={lang} />
        </div>
      </div>
    </nav>
  )
}
