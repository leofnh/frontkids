/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        // Cores essenciais apenas
        "app-green": "#009406",
        "app-bg-color": "#695018",
        "app-text-color": "#ed8c3b",

        brand: {
          50: "#fef7ed",
          500: "#ed8c3b",
          600: "#d97706",
        },

        brown: {
          50: "#faf8f3",
          500: "#695018",
          800: "#3e2e0e",
        },
      },
    },
  },
  plugins: [],
};
