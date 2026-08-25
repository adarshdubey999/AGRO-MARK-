/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          50: '#f2f9f4',
          100: '#e1f2e6',
          200: '#c5e5ce',
          300: '#99d2aa',
          400: '#64b67f',
          500: '#3e9a5d',
          600: '#2e7d48',
          700: '#27633c',
          800: '#234f32',
          900: '#1e422b',
          950: '#0f2417',
        },
        harvest: {
          50: '#fef9ee',
          100: '#fdf1d6',
          200: '#fae0ab',
          300: '#f7cb76',
          400: '#f3b03f',
          500: '#ee9518',
          600: '#d5760f',
          700: '#b15510',
          800: '#8e4414',
          900: '#733914',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
