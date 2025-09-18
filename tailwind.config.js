
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        goldLight: '#FFD700',
        goldDeep: '#D4AF37',
        royal: '#0F4C81'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, #FFD700, #D4AF37)'
      }
    },
  },
  plugins: [],
};
