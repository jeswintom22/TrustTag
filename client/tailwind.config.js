/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0D1B2A",
        danger: "#C0392B",
        safe: "#1A7A4A",
        teal: {
          DEFAULT: "#1ABC9C",
          400: "#2dd4bf",
          300: "#5eead4",
          500: "#14b8a6",
          600: "#0d9488",
          900: "#134e4a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
