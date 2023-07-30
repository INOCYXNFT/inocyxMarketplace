/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  important: "#__next",
  theme: {
    extend: {

      animation: {
        spin: 'spin 8s linear infinite',
        beat: 'beat 1s ease-in-out infinite',

      },
      keyframes: {
        beat: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' }
        }
      },

      fontFamily: {
        Robtronika: ["Robtronika"],
        KronaOne: ["Krona One"],
        sans: ["DM Sans"],
        blackOps: ["Black Ops One"],
        mulish: ["Mulish"],
      },
      colors: {
        primary: "#DA1B9B",
        secondary: "#06D2F5",
        tertiary: "#F3B35A",
        background: "#171738",
        forground: "#07071B",
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#f5f5f5",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#9e9e9e",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
        },
      },
      width: {
        contain: "96%",
      },
      height: {
        full: "100vh",
      },
    },
  },
  plugins: []
};
