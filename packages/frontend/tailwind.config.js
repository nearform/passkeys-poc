/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        uniform: '0 0 4px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
};
