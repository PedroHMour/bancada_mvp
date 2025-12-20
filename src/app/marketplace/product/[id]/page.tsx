"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "../../../../presentation/hooks/useProducts";
import { BaseButton } from "../../../../presentation/design/components/buttons";
// Imports limpos
import { ArrowLeft, ShoppingCart, CheckCircle2, Printer, Star } from "lucide-react";
import { ProductType } from "@/core/entities/Product";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const { product, loading, fetchProductById, fetchProductsByMaker, products: makerProducts } = useProducts();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
        fetchProductById(params.id as string);
    }
  }, [params.id, fetchProductById]);

  useEffect(() => {
    if (product?.makerId) {
        fetchProductsByMaker(product.makerId);
    }
  }, [product, fetchProductsByMaker]);


  if (loading || !product) {
     return <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center text-white">Carregando detalhes...</div>;
  }

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ["https://placehold.co/1080x1920/png?text=Sem+Imagem"];

  return (
    <div className="min-h-screen bg-[#0B0C15] pt-28 pb-20 px-6 text-slate-200">
      <div className="container-custom max-w-6xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20}/> Voltar
        </button>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#131525]">
                    <Image src={images[activeImageIndex]} alt={product.name} fill className="object-cover" unoptimized/>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar-hidden">
                    {images.map((img, idx) => (
                        <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-brand-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                            <Image src={img} alt="" fill className="object-cover" unoptimized/>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col">
                <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-brand-primary uppercase mb-4">
                        {product.type === ProductType.SERVICE ? 'Serviço de Impressão' : product.type === ProductType.DIGITAL ? 'Arquivo Digital' : 'Produto Físico'}
                    </span>
                    <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
                    <p className="text-3xl font-bold text-brand-primary mb-6">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </p>
                    <div className="bg-[#131525] p-6 rounded-2xl border border-white/5 mb-8 text-slate-400 leading-relaxed whitespace-pre-wrap">
                        {product.description || "Sem descrição disponível."}
                    </div>
                    <BaseButton size="lg" className="w-full md:w-auto bg-brand-primary hover:bg-brand-hover text-white font-bold px-8 shadow-lg shadow-brand-primary/20 border-0">
                        <ShoppingCart className="mr-2"/> Adicionar ao Carrinho
                    </BaseButton>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Vendido e Produzido por</h3>
                    <div className="bg-[#131525] p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-brand-primary/30 transition-colors cursor-pointer">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/10">M</div>
                        <div>
                            <h4 className="text-white font-bold text-lg flex items-center gap-2">Maker Parceiro <CheckCircle2 size={16} className="text-blue-400"/></h4>
                            <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                <span className="flex items-center gap-1"><Printer size={14}/> Maker Verificado</span>
                                <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500"/> 5.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">Mais deste Maker (Estante)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {makerProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                    <Link href={`/marketplace/product/${p.id}`} key={p.id} className="group">
                        <div className="bg-[#131525] rounded-xl border border-white/5 overflow-hidden hover:border-brand-primary/40 transition-all hover:-translate-y-1">
                             <div className="relative aspect-[3/4] w-full bg-[#0B0C15]">
                                <Image src={p.imageUrls[0] || ""} alt={p.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" unoptimized/>
                             </div>
                             <div className="p-4">
                                <h4 className="text-white font-bold truncate text-sm">{p.name}</h4>
                                <p className="text-brand-primary text-sm font-bold mt-1">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                                </p>
                             </div>
                        </div>
                    </Link>
                 ))}
                 {makerProducts.filter(p => p.id !== product.id).length === 0 && (
                    <p className="text-slate-500 col-span-4 text-center py-8">Este maker ainda não possui outros produtos cadastrados.</p>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}