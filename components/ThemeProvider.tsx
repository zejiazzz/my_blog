'use client'

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'dark', toggle: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function subscribeTheme(onChange: () => void) {
  if (typeof window === 'undefined') return () => {}

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handleMediaChange = () => {
    if (!localStorage.getItem('theme')) onChange()
  }
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'theme') onChange()
  }

  media.addEventListener('change', handleMediaChange)
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('themechange', onChange)

  return () => {
    media.removeEventListener('change', handleMediaChange)
    window.removeEventListener('storage', handleStorageChange)
    window.removeEventListener('themechange', onChange)
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribeTheme, readTheme, () => 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
    window.dispatchEvent(new Event('themechange'))
  }

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}
