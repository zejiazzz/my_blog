'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);
    if (res.ok) {
      window.location.href = '/admin';
    } else {
      const data = await res.json();
      setError(data.error || 'Access denied.');
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Terminal window chrome */}
        <div
          className="rounded-t-lg px-4 py-2.5 flex items-center gap-2"
          style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#f7768e' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff9e64' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#9ece6a' }} />
          <span className="font-mono text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
            auth — bash
          </span>
        </div>

        <div
          className="p-6 rounded-b-lg"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderTop: 'none',
          }}
        >
          <p className="font-mono text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-green)' }}>❯</span>{' '}
            <span style={{ color: 'var(--accent)' }}>sudo</span> access admin
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block font-mono text-xs mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                # email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="input-dark font-mono"
              />
            </div>

            <div>
              <label
                className="block font-mono text-xs mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                # password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-dark font-mono"
              />
            </div>

            {error && (
              <p className="font-mono text-xs" style={{ color: 'var(--accent-red)' }}>
                <span>✗</span> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full font-mono"
            >
              {loading ? 'authenticating...' : '→ login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
