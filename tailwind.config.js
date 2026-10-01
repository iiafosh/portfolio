/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
        pixel: ['Silkscreen', 'monospace'],
        gaming: ['Orbitron', 'sans-serif'],
        tactical: ['"Chakra Petch"', 'sans-serif'],
        arcade: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        canvas: '#0c0c0c',
        card: '#111113',
        cyber: {
          neon: '#00ffcc',
          blue: '#00d2ff',
          purple: '#9d4edd',
          amber: '#ffb703',
        },
      },
    },
  },
  plugins: [],
}
