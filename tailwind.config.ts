import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-deep': 'var(--bg-deep)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-dim': 'var(--ink-dim)',
        line: 'var(--line)',
        'line-soft': 'var(--line-soft)',
        moss: 'var(--moss)',
        'moss-up': 'var(--moss-up)',
        wood: 'var(--wood)',
        'wood-deep': 'var(--wood-deep)',
        concrete: 'var(--concrete)',
        'concrete-deep': 'var(--concrete-deep)',
        leather: 'var(--leather)',
        'leather-up': 'var(--leather-up)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        DEFAULT: 'var(--r)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
    },
  },
  plugins: [],
}

export default config
