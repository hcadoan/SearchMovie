/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ocean: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        mint: {
          50: "#effdf8",
          100: "#d6fbef",
          200: "#aff5df",
          300: "#74e9c9",
          500: "#14b8a6",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(14, 116, 144, 0.12)",
        card: "0 14px 32px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
