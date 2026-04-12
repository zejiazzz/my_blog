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
        {/* Terminal-style logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="font-mono text-sm select-none"
            style={{ color: 'var(--text-muted)' }}
          >
            ~/blog
          </span>
          <span
            className="inline-block w-2 h-[0.9em] animate-blink align-middle"
            style={{ background: 'var(--accent)', marginBottom: '-1px' }}
          />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="font-mono text-xs px-3 py-1.5 rounded transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = 'var(--accent)';
              (e.target as HTMLElement).style.background = 'var(--accent-dim)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = 'var(--text-muted)';
              (e.target as HTMLElement).style.background = 'transparent';
            }}
          >
            posts
          </Link>
          <Link
            href="/admin"
            className="font-mono text-xs px-3 py-1.5 rounded transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = 'var(--accent)';
              (e.target as HTMLElement).style.background = 'var(--accent-dim)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = 'var(--text-muted)';
              (e.target as HTMLElement).style.background = 'transparent';
            }}
          >
            admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
