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
    <button onClick={toggle} className="lang-btn">
      {current === 'zh' ? 'EN' : '中'}
    </button>
  )
}
