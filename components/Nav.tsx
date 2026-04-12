import Link from 'next/link';

export default function Nav() {
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
            posts
          </Link>
          <Link href="/admin" className="nav-link font-mono text-xs px-3 py-1.5 rounded">
            admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
