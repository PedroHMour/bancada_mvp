// src/presentation/design/tokens/colors.ts

export const colors = {
  // Laranja Enérgico (Ação, Criatividade, Calor)
  primary: {
    DEFAULT: '#FF6600', // Laranja safety/maker
    hover: '#FF8533',
    active: '#CC5200',
    foreground: '#FFFFFF',
  },
  // Azul Petróleo / Escuro (Tecnologia, Seriedade, Fundo)
  secondary: {
    DEFAULT: '#0F172A', // Slate 900 base
    light: '#1E293B',   // Slate 800 (Cards)
    dark: '#020617',    // Slate 950 (Background profundo)
  },
  // Cinza Concreto / Grafite (Oficina, Material Real)
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0', // Concreto claro
    300: '#CBD5E1',
    400: '#94A3B8', // Metal fosco
    500: '#64748B', // Concreto médio
    600: '#475569',
    700: '#334155', // Grafite
    800: '#1E293B',
    900: '#0F172A',
  },
  // Verde Neon Suave (Inovação, Digital, Status Online)
  accent: {
    green: '#00FF94', 
    purple: '#7C3AED', // Manter apenas para detalhes muito específicos se precisar
  },
  status: {
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  }
} as const;