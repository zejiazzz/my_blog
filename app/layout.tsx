import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import ThemeProvider from '@/components/ThemeProvider'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A personal blog',
}

// Inline script: apply theme before first paint to prevent flash (rendering-hydration-no-flicker)
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var theme = stored || preferred;
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} min-h-screen`}>
        <ThemeProvider>
          <Nav />
          <main className="page-container">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
