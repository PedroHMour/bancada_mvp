"use client";

import { Product } from "@/types";
import { ProductCard } from "../molecules/ProductCard";
import { Loader2, PackageOpen } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  // Estado de Carregamento (Skeleton Dark)
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[#131525] rounded-2xl h-[380px] animate-pulse border border-white/5"></div>
         ))}
      </div>
    );
  }

  // Estado Vazio
  if (!products || products.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-[#131525]/50 rounded-3xl border border-dashed border-white/10">
            <PackageOpen className="w-16 h-16 text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum item encontrado</h3>
            <p className="text-slate-400">Tente buscar por outro termo ou categoria.</p>
        </div>
    );
  }

  // Grid Real
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}