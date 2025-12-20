"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../presentation/contexts/AuthContext";
import { useMakers } from "../../../presentation/hooks/useMakers";
import { useProducts } from "../../../presentation/hooks/useProducts";
import { BaseButton } from "../../../presentation/design/components/buttons";
import { Plus, Package, Edit, Trash2, Box, Layers, FileCode, Loader2, Images } from "lucide-react";
import { ProductType } from "@/core/entities/Product";

// CARROSSEL DARK
const ProductCarousel = ({ images, productName, type }: { images: string[], productName: string, type: ProductType }) => {
    const hasMultiple = images && images.length > 1;
    const safeImages = images && images.length > 0 ? images : [];
    
    let TypeIcon = Box;
    if (type === ProductType.SERVICE) TypeIcon = Layers;
    if (type === ProductType.DIGITAL) TypeIcon = FileCode;
  
    return (
      <div className="relative h-64 bg-[#0F101B] group border-b border-white/5">
        <div className={`flex overflow-x-auto h-full snap-x snap-mandatory ${hasMultiple ? 'custom-scrollbar-hidden' : ''}`}>
            {safeImages.map((src, index) => (
                <div key={index} className="relative w-full h-full flex-shrink-0 snap-center">
                    <Image 
                      src={src} 
                      alt={`${productName} - ${index}`}
                      fill 
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                      unoptimized
                    />
                </div>
            ))}
            {safeImages.length === 0 && (
                 <div className="relative w-full h-full flex-shrink-0 snap-center flex items-center justify-center text-slate-600 bg-[#131525]">
                    <Package size={32} className="opacity-50"/>
                 </div>
            )}
        </div>
  
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-200 uppercase flex items-center gap-1 z-10 border border-white/10">
          <TypeIcon size={12}/>
          {type === ProductType.SERVICE ? 'Serviço' : type === ProductType.DIGITAL ? 'Digital' : 'Produto'}
        </div>
  
        {hasMultiple && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 z-10 pointer-events-none border border-white/10">
               <Images size={10} /> +{safeImages.length - 1}
            </div>
        )}
      </div>
    );
};

export default function MyProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { makerProfile, fetchMakerData } = useMakers();
  const { products, loading, fetchProductsByMaker, deleteProduct } = useProducts();

  useEffect(() => {
    if (user && !makerProfile) fetchMakerData();
  }, [user, makerProfile, fetchMakerData]);

  useEffect(() => {
    if (makerProfile?.id) {
      fetchProductsByMaker(makerProfile.id);
    }
  }, [makerProfile, fetchProductsByMaker]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja apagar "${name}"?`)) {
        try {
            await deleteProduct(id);
        } catch (error: any) {
            alert("Erro ao apagar: " + error.message);
        }
    }
  }

  if (loading && products.length === 0) {
    return <div className="min-h-[50vh] flex justify-center items-center"><Loader2 className="animate-spin text-brand-primary"/></div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Header Dark */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Catálogo</h1>
          <p className="text-slate-400">Gerencie seus produtos e serviços ativos na plataforma.</p>
        </div>
        <Link href="/makers/products/new">
          <BaseButton className="bg-brand-primary hover:bg-brand-hover text-white shadow-lg shadow-brand-primary/20 border-0">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Novo
          </BaseButton>
        </Link>
      </div>

      {products.length === 0 && !loading ? (
        <div className="bg-[#131525] rounded-2xl border border-white/5 p-16 text-center flex flex-col items-center animate-fade-in-up">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-500 border border-white/5">
             <Package size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum item cadastrado</h3>
          <p className="text-slate-400 mb-8 max-w-xs">Comece a vender adicionando seu primeiro produto ou serviço.</p>
          <Link href="/makers/products/new">
              <BaseButton variant="outline" className="border-white/10 text-white hover:bg-white/5">Cadastrar Agora</BaseButton>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {products.map((product) => (
            <div key={product.id} className="bg-[#131525] rounded-2xl border border-white/5 overflow-hidden hover:border-brand-primary/30 transition-all duration-300 group hover:-translate-y-1 shadow-lg">
              
              <ProductCarousel 
                  images={product.imageUrls || []} 
                  productName={product.name} 
                  type={product.type} 
              />
              
              <div className="p-5">
                <h3 className="font-bold text-white mb-1 truncate text-lg">{product.name}</h3>
                <p className="text-sm text-slate-400 truncate mb-4">{product.description || "Sem descrição definida."}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="font-bold text-xl text-brand-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => router.push(`/makers/products/${product.id}/edit`)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}