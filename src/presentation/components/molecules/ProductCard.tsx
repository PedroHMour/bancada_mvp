"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Plus, Image as ImageIcon } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/presentation/hooks/useCart";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Compatibilidade segura sem usar 'any'
  const images = product.image_urls || product.imageUrls;
  const imageUrl = images && images.length > 0 ? images[0] : null;
  
  const categoryLabel = product.category || (product.type === 'physical' ? 'Produto Físico' : 'Serviço');

  return (
    <div className="group relative bg-[#0F172A] border border-white/5 hover:border-brand-orange/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full">
      
      {/* Imagem */}
      <div className="aspect-square w-full bg-[#1E293B] relative overflow-hidden">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
             <ImageIcon size={24} className="opacity-40 mb-2"/>
             <span className="text-[10px] uppercase font-bold opacity-50">Sem Imagem</span>
          </div>
        )}
        
        {/* Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
          <span className="text-[10px] font-bold uppercase text-white tracking-wider">
            {categoryLabel}
          </span>
        </div>

        {/* Quick Add (Hover) */}
        <button 
           onClick={() => addToCart(product)}
           className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-brand-orange text-white rounded-lg shadow-lg hover:scale-110"
        >
           <Plus size={18} />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/marketplace/product/${product.id}`} className="block flex-1">
          <h3 className="text-white font-bold text-base mb-1 line-clamp-2 group-hover:text-brand-orange transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-400 text-xs mb-4 line-clamp-2">
            {product.description || "Sem descrição."}
          </p>
        </Link>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold">A partir de</span>
            <span className="text-lg font-bold text-brand-neon">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-brand-orange hover:text-white transition-all"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}