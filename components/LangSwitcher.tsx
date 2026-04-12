'use client'

import { useTransition } from 'react'
import type { Lang } from '@/lib/i18n'

export default function LangSwitcher({ current }: { current: Lang }) {
  const [, startTransition] = useTransition()

  function toggle() {
    const next = current === 'zh' ? 'en' : 'zh'
    document.cookie = `lang=${next}; path=/; max-age=31536000`
    startTransition(() => {
      window.location.reload()
    })
  }

  return (
    <button
      onClick={toggle}
      className="nav-link font-mono text-xs px-3 py-1.5 rounded"
      style={{ cursor: 'pointer', background: 'none', border: 'none' }}
    >
      {current === 'zh' ? 'EN' : '中'}
    </button>
  )
}
