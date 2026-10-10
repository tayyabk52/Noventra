import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)", ink: "var(--color-ink)", accent: "var(--color-accent)",
        "accent-strong": "var(--color-accent-strong)", hero: "var(--color-hero)", muted: "var(--color-muted)", rule: "var(--color-rule)"
      },
      fontFamily: { sans: ["var(--font-body)"], display: ["var(--font-display)"] },
      screens: { sm: "40rem", md: "48rem", lg: "64rem", xl: "90rem" }
    }
  }
} satisfies Config;
