/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
  ink: "#050505",
  cream: "#f7f8fa",
  brand: "#ffd400",
  silver: "#c9ccd1",
        // Luxury gold palette — used on the Booking page redesign
        gold: {
          DEFAULT: "#ffd400",
          bright: "#ffe45c",
          soft: "#d8b400",
        },
        charcoal: {
          DEFAULT: "#111111",
          deep: "#050505",
          rich: "#0A0A0A",
        },
        offwhite: "#F5F1E8",
      },
      boxShadow: {
        gold: "0 0 40px -8px rgba(255, 212, 0, 0.35)",
        "gold-sm": "0 0 20px -4px rgba(255, 212, 0, 0.25)",
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