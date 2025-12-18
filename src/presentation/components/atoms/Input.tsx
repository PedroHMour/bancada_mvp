// src/presentation/components/atoms/Input.tsx
import { BaseInput } from "@/presentation/design/components/inputs"; // Importação corrigida
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, ChangeEvent } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  isTextArea?: false;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  isTextArea: true;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

type CombinedInputProps = InputProps | TextAreaProps;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, CombinedInputProps>(
  ({ error, label, isTextArea, ...props }, ref) => {
    return <BaseInput ref={ref} error={error} label={label} isTextArea={isTextArea as any} {...props} />; // Usar as any para isTextArea aqui
  }
);

Input.displayName = "Input";
