/** @type {import('tailwindcss').Config} */

// Every colour is a CSS variable defined in src/index.css (:root + html[data-skin]).
// Channels are space-separated RGB so opacity modifiers (bg-accent/10) keep working.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
        // Gaming display fonts: Chakra Petch for headings, Orbitron for the hero name and big numerals.
        display: ['"Chakra Petch"', 'Geist', 'sans-serif'],
        hero: ['Orbitron', '"Chakra Petch"', 'sans-serif'],
        pixel: ['Silkscreen', 'monospace'],
        // Handwritten margin notes.
        hand: ['Caveat', 'cursive'],
      },
      colors: {
        // Semantic tokens (use these).
        bg: v('bg'),
        surface: { DEFAULT: v('surface'), 2: v('surface-2') },
        text: v('text'),
        muted: v('muted'),
        faint: v('faint'),
        accent: { DEFAULT: v('accent'), strong: v('accent-strong'), 2: v('accent-2'), 3: v('accent-3') },
        ok: v('ok'),
        line: { DEFAULT: 'var(--line)', strong: 'var(--line-strong)' },

        // Legacy aliases, mapped onto the semantic tokens so older markup
        // (src/components/mascot) keeps following the active skin.
        // Do not use in new code.
        slime: {
          100: v('accent'),
          200: v('accent'),
          300: v('accent'),
          400: v('accent'),
          500: v('accent-strong'),
          600: v('accent-strong'),
          glow: 'var(--slime-glow)',
        },
        ink: {
          950: v('bg'),
          900: v('bg'),
          850: v('surface'),
          800: v('surface'),
          700: v('surface-2'),
        },
        fg: { DEFAULT: v('text'), muted: v('muted'), faint: v('faint') },
        live: v('ok'),
      },
      boxShadow: {
        card: '0 1px 0 rgb(255 255 255 / 0.04) inset, 0 18px 40px -24px rgb(0 0 0 / 0.75)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.35), 0 0 28px -4px rgb(var(--accent) / 0.45)',
      },
      maxWidth: {
        content: '980px',
        measure: '68ch',
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
        'fade-up': 'fade-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'pop-in': 'pop-in 0.18s cubic-bezier(0.2, 0.8, 0.2, 1) both',
      },
    },
  },
  plugins: [],
}
