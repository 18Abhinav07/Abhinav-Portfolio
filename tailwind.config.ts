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
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-lg": ["80px", { lineHeight: "90px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg-mobile": ["48px", { lineHeight: "52px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg": ["40px", { lineHeight: "48px", fontWeight: "600" }],
        "headline-md": ["32px", { lineHeight: "40px", fontWeight: "500" }],
        "headline-sm": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-mono": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        "data-point": ["14px", { lineHeight: "20px", fontWeight: "400" }],
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
