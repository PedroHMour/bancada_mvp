import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "../utils/cn";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

export const BaseInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, helperText, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">
            {label}
          </label>
        )}

        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors z-10">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // DESIGN CORRIGIDO:
              // 1. bg-[#131525]: Mais claro que o fundo da página (#0B0C15) para criar profundidade.
              // 2. border-white/10: Borda sutil, mas visível.
              // 3. text-white: Texto branco puro para leitura fácil.
              "w-full bg-[#131525] text-white border border-white/10 rounded-xl px-4 py-3.5 text-sm transition-all duration-200",
              "placeholder:text-slate-500", // Placeholder mais escuro para não confundir
              
              // Focus: Borda laranja vibrante
              "focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 focus:bg-[#1A1C2E]",
              
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-red-400 text-xs pl-1 animate-enter">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";