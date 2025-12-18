// src/presentation/components/atoms/Button.tsx
"use client";

import { BaseButton } from "@/presentation/design/components/buttons"; // Importação corrigida para o seu arquivo original
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  ...props
}: ButtonProps) => {
  return (
    <BaseButton
      variant={variant}
      size={size}
      loading={loading}
      className={className}
      {...props}
    >
      {children}
    </BaseButton>
  );
};
