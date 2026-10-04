/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
        // Gaming display fonts: Chakra Petch for headings, Orbitron for the hero name only.
        display: ['"Chakra Petch"', 'Geist', 'sans-serif'],
        hero: ['Orbitron', '"Chakra Petch"', 'sans-serif'],
        pixel: ['Silkscreen', 'monospace'],
      },
      colors: {
        ink: {
          950: '#06080f',
          900: '#0a0e19',
          850: '#0e1322',
          800: '#121a2c',
          700: '#1b2540',
        },
        // Primary accent, sampled from the Rimuru slime mascot.
        slime: {
          100: '#dff6ff',
          200: '#b5ecff',
          300: '#86dcff',
          400: '#4fc8ff',
          500: '#22adf0',
          600: '#1189c7',
          glow: 'rgba(79, 200, 255, 0.35)',
        },
        // Secondary accent, used sparingly (music, tags).
        arcane: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        live: '#4ade80',
        fg: {
          DEFAULT: '#e7edf8',
          muted: '#9aa6bd',
          faint: '#5f6b85',
        },
        line: 'rgba(148, 180, 255, 0.10)',
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 16px 40px -18px rgba(0,0,0,0.7)',
        glow: '0 0 0 1px rgba(79,200,255,0.35), 0 0 28px -4px rgba(79,200,255,0.45)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'translateY(4px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'pop-in': 'pop-in 0.18s cubic-bezier(0.2, 0.8, 0.2, 1) both',
      },
    },
  },
  plugins: [],
}
