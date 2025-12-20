// src/presentation/design/components/cards.tsx
import { cn } from "../utils/cn";
import { HTMLAttributes, ReactNode } from "react";

interface BaseCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

export const BaseCard = ({ children, hover = false, className, ...props }: BaseCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-6 shadow-lg transition-all duration-300",
        hover && "hover:shadow-glow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
