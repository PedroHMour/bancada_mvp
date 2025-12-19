"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useMakers } from "@/presentation/hooks/useMakers";
import { useProducts } from "@/presentation/hooks/useProducts";
import { BaseButton } from "@/presentation/design/components/buttons";
import { Plus, Package, Edit, Trash2, Box, Layers } from "lucide-react";
import { ProductType } from "@/core/entities/Product";

export default function MyProductsPage() {
  const { user } = useAuth();
  const { makerProfile, fetchMakerData } = useMakers(); // Para pegar o ID do Maker
  const { products, loading, fetchProductsByMaker } = useProducts();

  // 1. Garante que temos o perfil do Maker carregado
  useEffect(() => {
    if (user && !makerProfile) {
        fetchMakerData();
    }
  }, [user, makerProfile, fetchMakerData]);

  // 2. Busca os produtos desse Maker
  useEffect(() => {
    if (makerProfile?.id) {
      fetchProductsByMaker(makerProfile.id);
    }
  }, [makerProfile, fetchProductsByMaker]);

  if (loading) {
    return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="container-custom max-w-6xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Meus Produtos & Serviços</h1>
            <p className="text-slate-500">Gerencie seu catálogo visível no marketplace.</p>
          </div>
          <Link href="/makers/products/new">
            <BaseButton className="bg-brand-primary hover:bg-brand-hover text-white shadow-lg shadow-brand-primary/20">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Novo
            </BaseButton>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
               <Package size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum item cadastrado</h3>
            <p className="text-slate-500 max-w-md mb-6">
              Sua vitrine está vazia. Adicione produtos físicos ou serviços de impressão para começar a vender.
            </p>
            <Link href="/makers/products/new">
                <BaseButton variant="outline">Cadastrar Agora</BaseButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative h-48 bg-slate-100">
                   {product.imageUrl ? (
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        fill 
                        className="object-cover"
                        unoptimized
                      />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={40} />
                      </div>
                   )}
                   <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                      {product.type === ProductType.SERVICE ? <Layers size={12}/> : <Box size={12}/>}
                      {product.type === ProductType.SERVICE ? 'Serviço' : 'Produto'}
                   </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{product.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="font-bold text-lg text-brand-primary">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
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