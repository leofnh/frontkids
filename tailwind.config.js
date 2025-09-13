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
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Cores oficiais da loja mantidas
        "app-green": "#009406",
        "app-bg-color": "#695018",
        "app-text-color": "#ed8c3b",
        "app-bg-color-text": "#ed8c3b",
        "app-bg-color-2": "#ed8c3b",
        "app-text-color-2": "#695018",

        // Nova paleta moderna baseada nas cores oficiais
        brand: {
          50: "#fef7ed", // Muito claro (base laranja)
          100: "#fdedd3", // Claro
          200: "#fbd9a6", // Médio claro
          300: "#f8c078", // Médio
          400: "#f5a449", // Médio escuro
          500: "#ed8c3b", // Principal laranja (cor oficial)
          600: "#d97706", // Escuro
          700: "#b45309", // Muito escuro
          800: "#92400e", // Extra escuro
          900: "#78350f", // Máximo escuro
        },

        brown: {
          50: "#faf8f3", // Muito claro (base marrom)
          100: "#f0eade", // Claro
          200: "#e0d1b8", // Médio claro
          300: "#ceb687", // Médio
          400: "#b89855", // Médio escuro
          500: "#695018", // Principal marrom (cor oficial)
          600: "#5c4615", // Escuro
          700: "#4d3a12", // Muito escuro
          800: "#3e2e0e", // Extra escuro
          900: "#2d210a", // Máximo escuro
        },

        // Cores complementares para UI moderna
        neutral: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },
      maxHeight: {
        "80vh": "80vh",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
