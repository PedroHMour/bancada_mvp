// src/presentation/design/components/buttons.tsx
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/presentation/design/utils/cn";
import { Loader2 } from "lucide-react"; // Ícone de loading

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean; // Nova prop
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
  const baseClasses = "flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200";

  const variantClasses = {
    primary: "bg-brand-primary text-white hover:bg-brand-hover shadow-glow",
    secondary: "bg-brand-secondary text-white hover:bg-brand-hover",
    ghost: "bg-transparent text-brand-primary hover:bg-brand-light",
    outline: "bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-light",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin h-5 w-5" />}
      {children}
    </button>
  );
};
