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
        bg: "#16130e",
        primary: { DEFAULT: "#e6c479", on: "#16130e" },
        secondary: { DEFAULT: "#bdf532", on: "#16130e" },
        surface: {
          DEFAULT: "#16130e",
          dim: "#100e09",
          bright: "#1d1a14",
          "container-lowest": "#0A0908",
          "container-low": "#1a1610",
          container: "#1f1b14",
          "container-high": "#26221a",
          "container-highest": "#2e2920",
        },
        "on-surface": "#e9e1d9",
        "on-surface-variant": "#bdb5a8",
        "surface-variant": "#38342e",
        outline: "#8a8276",
        "outline-variant": "#4d4639",
        error: "#ff6b6b",
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
        display: ["var(--font-playfair)", "Georgia", "serif"],
        fraunces: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
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
        pill: "9999px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [forms, containerQueries],
};

export default config;
