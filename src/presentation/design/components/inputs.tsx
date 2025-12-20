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
        {/* Label com estilo técnico */}
        {label && (
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Ícone Esquerda */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-orange transition-colors">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base Styles
              "w-full bg-[#0F172A] text-slate-200 border border-slate-700 rounded-lg px-4 py-3 text-sm transition-all duration-200",
              "placeholder:text-slate-600",
              // Focus Styles
              "focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 focus:bg-[#131B2E]",
              // Disabled Styles
              "disabled:opacity-50 disabled:cursor-not-allowed",
              // Error Styles
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
              // Padding adjustments for icons
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />

          {/* Ícone Direita */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Mensagens de Erro ou Ajuda */}
        {error ? (
          <div className="flex items-center gap-1.5 text-red-500 text-xs pl-1 animate-in slide-in-from-top-1">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <p className="text-slate-500 text-xs pl-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";