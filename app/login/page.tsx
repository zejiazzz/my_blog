'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    setLoading(false)
    if (res.ok) {
      window.location.href = '/admin'
    } else {
      const data = await res.json()
      setError(data.error || 'Access denied.')
    }
  }

  return (
    <div className="page-shell page-shell--editor auth-shell">
      <div className="auth-card">
        <div className="admin-page-hero auth-hero">
          <span className="admin-eyebrow">Editorial Access</span>
          <h1 className="page-title page-title--admin">
            Sign in to the dashboard
          </h1>
          <p className="admin-page-copy">
            Use your admin account to manage articles, skills, and site content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="editor-field editor-field--plain">
            <label className="field-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="input-dark"
            />
          </div>

          <div className="editor-field editor-field--plain">
            <label className="field-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input-dark"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
