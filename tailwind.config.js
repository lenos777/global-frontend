/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'logo-blue': '#1a365d',
        'logo-blue-light': '#2d5aa0',
        'logo-red': '#e53e3e',
        'logo-red-light': '#fc8181',
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        red: {
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}