// src/presentation/design/components/buttons.tsx
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/presentation/design/utils/cn";
import { Loader2 } from "lucide-react";

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon"; // Adicionamos "icon" aqui
  loading?: boolean;
}

export const BaseButton = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}: BaseButtonProps) => {
  const baseClasses = "flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95";

  const variantClasses = {
    primary: "bg-brand-primary text-white hover:bg-brand-hover shadow-lg shadow-brand-primary/25 border border-transparent",
    secondary: "bg-brand-light text-brand-primary hover:bg-brand-light/80 border border-transparent",
    ghost: "bg-transparent text-text-secondary hover:text-brand-primary hover:bg-brand-light/50",
    outline: "bg-transparent border border-border text-text-secondary hover:border-brand-primary hover:text-brand-primary",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "p-2 w-10 h-10", // Tamanho quadrado fixo para ícones
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin h-5 w-5" /> : children}
    </button>
  );
};