import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Laranja Vibrante (Alto Contraste no Preto)
          orange: "#FF5722", 
          "orange-hover": "#F4511E",
          
          // Verde Neon para detalhes
          neon: "#00FF94",
          
          // Tons de Cinza/Azul para Backgrounds
          dark: "#0B0C15",        // Fundo da Página (Preto Profundo)
          surface: "#1E293B",     // Fundo de Cards/Inputs (Cinza Azulado)
          border: "#334155",      // Bordas visíveis
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
      },
      boxShadow: {
        'maker': '4px 4px 0px 0px rgba(0, 0, 0, 0.5)', 
        'neon': '0 0 15px rgba(0, 255, 148, 0.15)',
      }
    },
  },
  plugins: [],
};
export default config;