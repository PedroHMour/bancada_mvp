import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes de forma inteligente
 * Evita conflitos e sobrescreve classes corretamente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
