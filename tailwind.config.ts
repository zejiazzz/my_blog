import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14',
        'bg-card': '#13161d',
        'bg-elevated': '#1a1e28',
        border: '#1f2433',
        'border-bright': '#2a3044',
        ink: '#c9d1e0',
        muted: '#5a6380',
        dim: '#3d4560',
        accent: '#7aa2f7',
        'accent-dim': '#1a2540',
        'accent-green': '#9ece6a',
        'accent-purple': '#bb9af7',
        'accent-orange': '#ff9e64',
        'accent-red': '#f7768e',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        blink: 'blink 1.2s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
