/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily:{
      bebas : "'Bebas Neue', sans-serif"
      },
      colors: {
        'azul-orpack': '#150774',
      },
    },
  },
  plugins: [],
}
