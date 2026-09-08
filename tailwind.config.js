/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#000000",
          secondary: "#050505",
          border: "rgba(255, 255, 255, 0.10)",
          borderHover: "rgba(255, 255, 255, 0.25)",
          text: "#F5F5F5",
          muted: "#8A8A8A",
          accent: "#FF3B1F",
          accentSecondary: "#FF5A24",
        },
      },
      fontFamily: {
        display: ["var(--font-space)", "var(--font-inter-tight)", "sans-serif"],
        bebas: ["var(--font-bebas)", "sans-serif"],
        space: ["var(--font-space)", "sans-serif"],
        tight: ["var(--font-inter-tight)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};
