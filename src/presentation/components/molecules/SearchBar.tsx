"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (term: string) => void;
}

export function SearchBar({ placeholder = "Buscar...", onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-500" size={20}/>
        </div>
        <input 
            type="text"
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#131525] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            placeholder={placeholder}
            onChange={(e) => onSearch && onSearch(e.target.value)}
        />
    </div>
  );
}