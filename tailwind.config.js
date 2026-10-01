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
        mono: ['Geist Mono', 'monospace'],
        pixel: ['Silkscreen', 'monospace'],
      },
      colors: {
        canvas: '#0c0c0c',
        card: '#121214',
      },
    },
  },
  plugins: [],
}
