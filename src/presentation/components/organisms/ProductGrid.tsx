import Link from "next/link";
import Image from "next/image";
import { Product, ProductType } from "@/core/entities/Product";
import { Box, Layers, FileCode, Loader2 } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export const ProductGrid = ({ products, loading }: ProductGridProps) => {
  if (loading) {
    return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-primary w-8 h-8" />
        </div>
    );
  }

  if (products.length === 0) {
    return (
        <div className="text-center py-20 text-slate-500">
            <p>Nenhum produto encontrado.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
      {products.map((product) => {
        let TypeIcon = Box;
        if (product.type === ProductType.SERVICE) TypeIcon = Layers;
        if (product.type === ProductType.DIGITAL) TypeIcon = FileCode;

        // Fallback se não houver imagem
        const coverImage = product.imageUrls?.[0] || "https://placehold.co/1080x1920/png?text=Sem+Imagem";

        return (
          <Link href={`/marketplace/product/${product.id}`} key={product.id} className="group">
            <div className="bg-[#131525] rounded-2xl border border-white/5 overflow-hidden hover:border-brand-primary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-brand-primary/10">
              
              {/* CORREÇÃO: aspect-[3/4] para equilibrar imagens verticais */}
              <div className="relative aspect-[3/4] w-full bg-[#0B0C15] overflow-hidden">
                 <Image 
                    src={coverImage} 
                    alt={product.name}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    unoptimized 
                 />
                 
                 {/* Badge de Tipo */}
                 <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-200 uppercase flex items-center gap-1 border border-white/10">
                    <TypeIcon size={10}/>
                    {product.type === ProductType.SERVICE ? 'Serviço' : product.type === ProductType.DIGITAL ? 'Digital' : 'Físico'}
                 </div>

                 {/* Preço e Nome com Gradiente */}
                 <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent pt-12">
                    <h3 className="font-bold text-white text-lg truncate mb-1">{product.name}</h3>
                    <p className="text-brand-primary font-bold text-xl">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </p>
                 </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};