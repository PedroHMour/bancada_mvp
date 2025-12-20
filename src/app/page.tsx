"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client"; // Import corrigido
import { BaseButton } from "@/presentation/design/components/buttons";
import { Search, Filter, ArrowRight, Loader2 } from "lucide-react";
import { Product } from "@/types"; // Usando o tipo global limpo
import { ProductCard } from "@/presentation/components/molecules/ProductCard"; // Usando o componente oficial

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Busca produtos reais do Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(20)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data as Product[] || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0B0C15] text-slate-200">
      
      {/* 1. HERO DE VENDAS (Design Original Mantido) */}
      <section className="relative pt-32 pb-12 px-6 border-b border-white/5 bg-[#050810]">
         <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
         <div className="container mx-auto max-w-7xl relative z-10">
            
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-8">
               <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider border border-brand-orange/20">
                     <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                     Marketplace Oficial
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                     Onde ideias viram <span className="text-brand-orange">realidade.</span>
                  </h1>
                  <p className="text-slate-400 text-lg">
                     Compre peças impressas em 3D ou contrate makers locais.
                  </p>
               </div>

               {/* Barra de Busca Principal */}
               <div className="w-full md:w-auto md:min-w-[400px]">
                  <div className="relative group">
                     <input 
                        type="text" 
                        placeholder="O que você procura hoje?" 
                        className="w-full h-14 pl-12 pr-4 bg-[#0F172A] border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all shadow-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-orange transition-colors" size={20} />
                     <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-hover transition-colors">
                        <ArrowRight size={18} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Categorias Rápidas */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
               {['Destaques', 'Action Figures', 'Peças de Reposição', 'Decoração', 'Cosplay', 'Gadgets', 'Prototipagem'].map((cat) => (
                  <button key={cat} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-orange/50 text-sm font-medium text-slate-300 hover:text-white transition-all whitespace-nowrap">
                     {cat}
                  </button>
               ))}
            </div>
         </div>
      </section>

      {/* 2. VITRINE DE PRODUTOS */}
      <section className="py-12 px-6 flex-1">
         <div className="container mx-auto max-w-7xl">
            
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Filter size={20} className="text-brand-orange" />
                  Produtos em Destaque
               </h2>
               <span className="text-sm text-slate-500">{products.length} resultados</span>
            </div>

            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1,2,3,4,5,6,7,8].map((i) => (
                     <div key={i} className="bg-white/5 rounded-xl h-80 animate-pulse border border-white/5"></div>
                  ))}
               </div>
            ) : products.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                     <ProductCard key={product.id} product={product} />
                  ))}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500">
                     <Search size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Nenhum produto encontrado</h3>
                  <p className="text-slate-400 mb-6">Seja o primeiro Maker a vender na Bancada!</p>
                  <Link href="/auth/signup">
                     <BaseButton>Começar a Vender</BaseButton>
                  </Link>
               </div>
            )}
         </div>
      </section>
    </div>
  );
}