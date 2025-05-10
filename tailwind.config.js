/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff7b25',
          50: '#fff8f0',
          100: '#ffecd8',
          200: '#ffd4ad',
          300: '#ffb578',
          400: '#ff9747',
          500: '#ff7b25',
          600: '#ff5d0a',
          700: '#cc4400',
          800: '#a73b04',
          900: '#88360b',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
