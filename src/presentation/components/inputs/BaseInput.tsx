// src/presentation/design/components/inputs/BaseInput.tsx
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/presentation/design/utils/cn"; // Certifique-se que este util existe

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isTextArea?: boolean; // Nova prop
}

interface BaseTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isTextArea: true; // Força isTextArea para true
}

type CombinedInputProps = BaseInputProps | BaseTextAreaProps;

export const BaseInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, CombinedInputProps>(
  ({ label, error, className, isTextArea, ...props }, ref) => {
    const inputClasses = cn(
      "w-full p-3 border rounded-xl focus:outline-none transition-all duration-200",
      "bg-white text-text-primary placeholder-text-muted",
      error ? "border-red-500 focus:ring-red-500/50" : "border-border-light focus:border-brand-primary focus:ring-brand-primary/50",
      className
    );

    const commonProps = {
      className: inputClasses,
      ...props,
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        {isTextArea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>} // Cast para textarea
            {...(commonProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={4}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>} // Cast para input
            {...(commonProps as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";
