/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          accent: "var(--primary-accent)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light: "var(--secondary-light)",
        },
        tertiary: "var(--tertiary)",
        accent: {
          DEFAULT: "var(--accent)",
          warm: "var(--accent-warm)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          hover: "var(--surface-hover)",
          blue: "var(--surface-blue)",
          "blue-hover": "var(--surface-blue-hover)",
        },
        border: {
          DEFAULT: "var(--border)",
          light: "var(--border-light)",
        },
        text: {
          blue: "var(--text-blue)",
          "blue-light": "var(--text-blue-light)",
          dark: "var(--text-dark)",
          readable: "var(--text-readable)",
        },
        muted: "var(--muted)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Segoe UI",
          "Tahoma",
          "Geneva",
          "Verdana",
          "sans-serif",
        ],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular"],
      },
      boxShadow: {
        ocean:
          "0 4px 6px -1px var(--shadow-blue), 0 2px 4px -1px var(--shadow)",
        "ocean-lg":
          "0 20px 25px -5px var(--shadow-blue), 0 10px 10px -5px var(--shadow)",
        "blue-glow":
          "0 0 20px var(--primary-accent), 0 0 40px var(--primary-light)",
        "blue-glow-subtle": "0 0 10px rgba(59, 130, 246, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
}
