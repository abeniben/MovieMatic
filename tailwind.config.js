/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rating: {
          low: '#ef4444',
          medium: '#f59e0b',
          high: '#22c55e'
        }
      }
    },
  },
  plugins: [],
};