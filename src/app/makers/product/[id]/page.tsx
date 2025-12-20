"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ArrowLeft, Loader2, Edit, ShoppingCart, Package, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/presentation/hooks/useProducts";
import { ProductType } from "@/core/entities/Product";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const { product, loading, fetchProductById } = useProducts();

  useEffect(() => {
    if (productId) {
        fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="ml-2 text-slate-500">Carregando detalhes...</span>
      </div>
    );
  }

  const coverImage = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="container-custom max-w-4xl">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/makers/products" className="text-sm text-slate-500 hover:text-brand-primary flex items-center gap-1 mb-1">
              <ArrowLeft size={14}/> Voltar ao Catálogo
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Detalhes do Produto</h1>
          </div>
          
          {/* LINK ATUALIZADO: Aponta para a nova rota /product/.../edit */}
          <Link href={`/makers/product/${productId}/edit`}>
             <BaseButton variant="outline" className="flex items-center gap-2 border-slate-300 hover:bg-slate-100">
                <Edit size={16}/> Editar
             </BaseButton>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid md:grid-cols-2">
            
            {/* Coluna da Imagem */}
            <div className="bg-slate-100 relative min-h-[400px] md:h-full border-r border-slate-100">
                {coverImage ? (
                    <Image 
                        src={coverImage} 
                        alt={product.name} 
                        fill 
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <Package size={48} className="mb-2 opacity-50"/>
                        <span>Sem Imagem</span>
                    </div>
                )}
                
                {product.imageUrls && product.imageUrls.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                        +{product.imageUrls.length - 1} fotos
                    </div>
                )}
            </div>

            {/* Coluna das Informações */}
            <div className="p-8 flex flex-col justify-center space-y-8">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                            product.type === ProductType.SERVICE 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-orange-100 text-orange-700"
                        }`}>
                            {product.type === ProductType.SERVICE ? "SERVIÇO" : "PRODUTO FÍSICO"}
                        </span>
                        
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                            Ativo no Marketplace
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">{product.name}</h2>
                    <p className="text-3xl font-black text-brand-primary">
                        R$ {product.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Info size={18} className="text-slate-400"/> Descrição
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {product.description || "O maker não forneceu uma descrição detalhada para este item."}
                    </p>
                </div>

                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Estoque Atual</span>
                        <span className="block text-xl font-bold text-slate-900 mt-1">
                             {product.type === ProductType.SERVICE ? "∞" : product.stock}
                        </span>
                    </div>
                     <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Vendas</span>
                        <span className="block text-xl font-bold text-slate-900 mt-1">0</span>
                    </div>
                </div>

                <BaseButton className="w-full mt-4 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed" size="lg" disabled>
                    <ShoppingCart size={18}/> Visualizar como Cliente (Em breve)
                </BaseButton>
            </div>
        </div>
      </div>
    </div>
  );
}