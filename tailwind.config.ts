import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        'brand-blue':      '#2e3fe2',
        'brand-gold':      '#ffc600',
        'brand-dark':      '#0d1117',
        'brand-dark-blue': '#1a1f4d',
        // shadcn/ui semantic tokens
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      fontFamily: {
        clash: ['"Clash Display"', 'sans-serif'],
        sans:  ['"General Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #2e3fe2 0%, #ffc600 100%)',
        'gradient-blue':  'linear-gradient(135deg, #2e3fe2 0%, #5b6ef7 100%)',
        'gradient-gold':  'linear-gradient(135deg, #ffc600 0%, #ffd966 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%':       { transform: 'translate(80px, -80px) rotate(120deg)' },
          '66%':       { transform: 'translate(-40px, 80px) rotate(240deg)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { transform: 'translateY(-100%)' },
          to:   { transform: 'translateY(0)' },
        },
        bgIconFloat: {
          '0%, 100%': { transform: 'rotate(var(--r, 0deg)) translateY(0px)' },
          '40%':      { transform: 'rotate(var(--r, 0deg)) translateY(-18px)' },
          '70%':      { transform: 'rotate(var(--r, 0deg)) translateY(10px)' },
        },
      },
      animation: {
        float:          'float 20s ease-in-out infinite',
        'fade-in-up':   'fadeInUp 1s ease both',
        'slide-down':   'slideDown 0.8s ease',
        'bg-icon-float':'bgIconFloat 14s ease-in-out infinite',
      },
    },
  },
  plugins: [animatePlugin],
}

export default config
