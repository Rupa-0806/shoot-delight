/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        cream: "#faf9f6",
        brand: "#e21c1f",
        silver: "#c9ccd1",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
