import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Plus } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrls: string[];
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.imageUrls[0] || "https://placehold.co/400x300/0B0C15/FFF?text=Maker+Part";

  return (
    <div className="group bg-[#131525] border border-white/5 rounded-2xl overflow-hidden hover:border-brand-primary transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-[#0B0C15]">
        <Image 
          src={imageUrl} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Badge de Categoria */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/30">
            {product.category}
          </span>
        </div>
        
        {/* Quick Add Button */}
        <button className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 bg-brand-primary rounded-xl text-white shadow-xl shadow-brand-primary/20 hover:scale-110">
          <Plus size={20} />
        </button>
      </div>

      <div className="p-5 space-y-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">A partir de</span>
            <span className="text-xl font-black text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}