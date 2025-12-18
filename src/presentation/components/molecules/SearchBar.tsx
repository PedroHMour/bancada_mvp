"use client";

import { Search } from "lucide-react";
import { Input } from "../atoms/Input";

interface SearchBarProps {
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  onChange,
  placeholder = "Buscar produtos...",
}: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        placeholder={placeholder}
        className="pl-12"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};
