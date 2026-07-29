/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'spark-blue': '#E0F2FE', // soft blue
        'spark-green': '#D1FAE5', // soft green
        'spark-gold': '#FBBF24', // gold accent
      }
    },
  },
  plugins: [],
}
