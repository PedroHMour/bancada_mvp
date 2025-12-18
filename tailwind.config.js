// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}", // Garanta que esta linha está presente
  ],
  theme: {
    extend: {
      colors: {
        background: {
          main: "hsl(var(--background-main))",
          card: "hsl(var(--background-card))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
        },
        brand: {
          primary: "hsl(var(--brand-primary))",
          hover: "hsl(var(--brand-hover))",
          light: "hsl(var(--brand-light))",
        },
        accent: {
          green: "hsl(var(--accent-green))",
          red: "hsl(var(--accent-red))",
        },
        border: "hsl(var(--border-color))",
      },
    },
  },
  plugins: [],
};
export default config;
