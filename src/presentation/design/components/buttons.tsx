import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const BaseButton = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) => {
  
  const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[2px] active:shadow-none";
  
  // Estilos baseados no Briefing: "Modularidade", "Blocos", "Acessível"
  const variants = {
    primary: "bg-brand-orange text-white border-2 border-transparent hover:bg-brand-orange-hover shadow-maker",
    secondary: "bg-brand-petrol-light text-slate-200 border-2 border-slate-700 hover:border-slate-500 hover:text-white shadow-maker",
    outline: "bg-transparent text-slate-300 border-2 border-slate-600 hover:border-brand-orange hover:text-brand-orange",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-maker",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
    md: "text-sm px-5 py-2.5 rounded-lg gap-2",
    lg: "text-base px-8 py-3.5 rounded-lg gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};