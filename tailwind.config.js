/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(32px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(.39,.575,.565,1) both'
      },
    }
  },
  plugins: [],
}