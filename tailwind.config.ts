import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-Energy Light — light cream canvas, high-velocity neon green + yellow accents.
        bg: "#FAF9F6",
        primary: { DEFAULT: "#BFFF00", on: "#07090F" }, // Neon Green
        secondary: { DEFAULT: "#FAFF00", on: "#07090F" }, // Neon Yellow
        accent: { DEFAULT: "#BFFF00", yellow: "#FAFF00" },
        surface: {
          DEFAULT: "#F3F4F6",
          dim: "#E5E7EB",
          bright: "#FAF9F6",
          "container-lowest": "#FFFFFF",
          "container-low": "#F9FAFB",
          container: "#F3F4F6",
          "container-high": "#E5E7EB",
          "container-highest": "#D1D5DB",
        },
        "on-surface": "#07090F",
        "on-surface-variant": "#4B5563",
        "surface-variant": "#E5E7EB",
        outline: "rgba(7, 9, 15, 0.1)",
        "outline-variant": "rgba(7, 9, 15, 0.05)",
        error: "#E11D48",
      },
      spacing: {
        "outer-gutter": "80px",
        "section-padding": "120px",
        "column-gap": "24px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        "stack-xl": "64px",
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-hanken)", "system-ui", "sans-serif"],
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-lg": ["clamp(3rem, 5vw + 2rem, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-lg": ["clamp(2rem, 3vw + 1.25rem, 2.5rem)", { lineHeight: "1.15", fontWeight: "600" }],
        "headline-md": ["clamp(1.5rem, 2vw + 1rem, 2rem)", { lineHeight: "1.2", fontWeight: "500" }],
        "headline-sm": ["clamp(1.25rem, 1.5vw + 0.875rem, 1.5rem)", { lineHeight: "1.25", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "label-mono": ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.05em", fontWeight: "500" }],
        "data-point": ["0.875rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        none: "0",
        xs: "2px",
        sm: "4px",
        lg: "20px",
        xl: "28px",
        pill: "9999px",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(94,232,255,0.35)",
        "glow-violet": "0 0 48px -10px rgba(139,124,255,0.40)",
        depth: "0 40px 100px -30px rgba(0,0,0,0.75)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [forms, containerQueries],
};

export default config;
