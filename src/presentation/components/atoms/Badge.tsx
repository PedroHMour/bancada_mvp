import { cn } from "@/presentation/design/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  color?: "primary" | "gray" | "success" | "warning" | "error";
  className?: string;
}

export const Badge = ({
  children,
  color = "primary",
  className,
}: BadgeProps) => {
  const colors = {
    primary: "bg-brand-primary/15 text-brand-primary",
    gray: "bg-gray-200 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-sm font-medium inline-block",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
};
