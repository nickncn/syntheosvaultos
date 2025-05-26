/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        starknet: {
          bg: "#0A0A0F",
          surface: "#1C1C24",
          primary: "#6C5DD3",
          accent: "#4F46E5",
          text: "#D1D5DB",
          soft: "#A3A3B2",
        },
      },
    },
  },
  plugins: [],
};
