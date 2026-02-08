/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#09090b",     // zinc-950
        foreground: "#fafafa",     // zinc-50
        card: "#18181b",           // zinc-900
        border: "#27272a",         // zinc-800
        muted: "#71717a",          // zinc-500
        primary: "#8b5cf6",        // violet-500
        "primary-foreground": "#ffffff",
        secondary: "#3f3f46",      // zinc-700
        accent: "#a78bfa",         // violet-400
        success: "#22c55e",        // green-500
        warning: "#eab308",        // yellow-500
        destructive: "#ef4444",    // red-500
      },
      borderRadius: {
        DEFAULT: "0.75rem",
      },
    },
  },
  plugins: [],
};
