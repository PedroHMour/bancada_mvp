import Image from "next/image";
import Link from "next/link";
import { Product } from "@/core/entities/Product";
import { BaseButton } from "@/presentation/design/components/buttons";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // CORREÇÃO AQUI: Pegamos a primeira imagem do array ou usamos um placeholder
  const coverImage = product.imageUrls?.[0] || "https://placehold.co/400x400/png?text=Sem+Imagem";

  return (
    <div className="bg-[#131525] border border-white/5 rounded-2xl p-4 hover:border-brand-primary/50 transition-all duration-300 group">
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
        <Image
          src={coverImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          unoptimized
        />
      </div>
      
      <h3 className="text-white font-bold text-lg mb-1 truncate">{product.name}</h3>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="text-brand-primary font-bold text-xl">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </span>
        <Link href={`/marketplace/product/${product.id}`}>
            <BaseButton size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0">
                Ver
            </BaseButton>
        </Link>
      </div>
    </div>
  );
};