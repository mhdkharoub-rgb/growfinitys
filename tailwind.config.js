/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0a0a23",
          accent: "#00ffd5",
        },
      },
    },
  },
  plugins: [],
};
