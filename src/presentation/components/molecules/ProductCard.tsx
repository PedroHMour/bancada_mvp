// src/presentation/components/molecules/ProductCard.tsx
import Image from "next/image";
import { Product } from "@/core/entities/Product";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { BaseCard } from "@/presentation/design/components/cards"; // Importação corrigida para o seu arquivo original

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  return (
    <BaseCard hover className="flex flex-col h-full">
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
        {product.name}
      </h3>

      <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">
        {product.description}
      </p>

      <div className="mt-3">
        <Badge color={product.type === "digital" ? "primary" : "gray"}>
          {product.type === "digital" ? "Arquivo STL" : "Produto Físico"}
        </Badge>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <span className="text-brand-primary font-bold text-xl">
          R$ {product.price.toFixed(2)}
        </span>

        <Button size="sm">Comprar</Button>
      </div>
    </BaseCard>
  );
};
