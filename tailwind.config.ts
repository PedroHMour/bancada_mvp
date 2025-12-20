import type { Config } from "tailwindcss";
import { colors } from "./src/presentation/design/tokens/colors";

const config: Config = {
  content: [
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: colors.primary.DEFAULT,
          'orange-hover': colors.primary.hover,
          petrol: colors.secondary.DEFAULT,
          'petrol-light': colors.secondary.light,
          dark: colors.secondary.dark,
          concrete: colors.neutral[500],
          neon: colors.accent.green,
        },
        background: colors.secondary.dark, // Fundo padrão
        surface: colors.secondary.light,   // Fundo de cards
      },
      fontFamily: {
        // Garantir que a fonte seja lida como "técnica mas acessível"
        sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'], 
      },
      backgroundImage: {
        // Textura sutil de grid para fundo (wireframe vibe)
        'grid-pattern': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
      },
      boxShadow: {
        // Sombras duras para dar sensação de "bloco" ou "peça física"
        'maker': '4px 4px 0px 0px rgba(0, 0, 0, 0.5)', 
        'maker-hover': '2px 2px 0px 0px rgba(0, 0, 0, 0.5)',
        'neon': '0 0 10px rgba(0, 255, 148, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;