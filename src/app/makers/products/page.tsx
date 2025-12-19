"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useMakers } from "@/presentation/hooks/useMakers";
import { useProducts } from "@/presentation/hooks/useProducts";
import { BaseButton } from "@/presentation/design/components/buttons";
import { Plus, Package, Edit, Trash2, Box, Layers, FileCode, Loader2, Images } from "lucide-react";
import { ProductType } from "@/core/entities/Product";

// COMPONENTE DE CARROSSEL
const ProductCarousel = ({ images, productName, type }: { images: string[], productName: string, type: ProductType }) => {
    const hasMultiple = images && images.length > 1;
    const safeImages = images && images.length > 0 ? images : [];
    
    let TypeIcon = Box;
    if (type === ProductType.SERVICE) TypeIcon = Layers;
    if (type === ProductType.DIGITAL) TypeIcon = FileCode;
  
    return (
      <div className="relative h-64 bg-slate-100 group">
        <div className={`flex overflow-x-auto h-full snap-x snap-mandatory ${hasMultiple ? 'custom-scrollbar-hidden' : ''}`}>
            {safeImages.map((src, index) => (
                <div key={index} className="relative w-full h-full flex-shrink-0 snap-center">
                    <Image 
                      src={src} 
                      alt={`${productName} - ${index}`}
                      fill 
                      className="object-cover" 
                      unoptimized
                    />
                </div>
            ))}
            {safeImages.length === 0 && (
                 <div className="relative w-full h-full flex-shrink-0 snap-center flex items-center justify-center text-slate-400 bg-slate-50">
                    <Package size={32} className="opacity-20"/>
                 </div>
            )}
        </div>
  
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 uppercase flex items-center gap-1 z-10 shadow-sm">
          <TypeIcon size={12}/>
          {type === ProductType.SERVICE ? 'Serviço' : type === ProductType.DIGITAL ? 'Digital' : 'Produto'}
        </div>
  
        {hasMultiple && (
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 z-10 pointer-events-none">
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
    return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="animate-spin text-brand-primary"/></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="container-custom max-w-6xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Catálogo</h1>
            <p className="text-slate-500">Gerencie seus produtos e serviços ativos.</p>
          </div>
          <Link href="/makers/products/new">
            <BaseButton className="bg-brand-primary hover:bg-brand-hover text-white shadow-lg shadow-brand-primary/20">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Novo
            </BaseButton>
          </Link>
        </div>

        {products.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
               <Package size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum item cadastrado</h3>
            <Link href="/makers/products/new">
                <BaseButton variant="outline">Cadastrar Agora</BaseButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                
                <ProductCarousel 
                    images={product.imageUrls || []} 
                    productName={product.name} 
                    type={product.type} 
                />
                
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                    <span className="font-bold text-lg text-brand-primary">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(`/makers/products/${product.id}/edit`)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
    </div>
  );
}