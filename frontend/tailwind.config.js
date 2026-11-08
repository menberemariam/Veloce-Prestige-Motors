/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#121318',
        surface: '#1a1b22',
        surface2: '#22232d',
        gold: '#f2ca50',
        golddeep: '#d4af37',
        muted: '#9aa0b0',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
