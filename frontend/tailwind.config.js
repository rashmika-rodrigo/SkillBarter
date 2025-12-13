/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // Deep Slate 
        surface: "#1e293b", // Lighter Slate for Cards
        primary: "#7c3aed", // Electric Purple
        secondary: "#2563eb", // Vibrant Blue
        accent: "#06b6d4", // Cyan for highlights
        text: "#f8fafc", // White for text
        muted: "#94a3b8", // Gray for secondary text
      }
    },
  },
  plugins: [],
}