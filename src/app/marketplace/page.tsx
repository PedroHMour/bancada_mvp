"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types";
import { ProductGrid } from "@/presentation/components/organisms/ProductGrid";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'service'>('all');

  useEffect(() => {
    fetchProducts();
  }, [activeFilter]); // Recarrega quando muda o filtro

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      
      if (activeFilter !== 'all') {
        query = query.eq('type', activeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data as Product[]);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtragem local pelo termo de busca (para MVP é mais rápido)
  const filteredProducts = products.filter(p => 
     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0C15] pt-24 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Cabeçalho da Loja */}
        <div className="mb-10">
            <h1 className="text-4xl font-black text-white mb-4">Catálogo Maker</h1>
            <p className="text-slate-400 max-w-2xl">
                Explore peças exclusivas, componentes eletrônicos e serviços de manufatura da nossa comunidade.
            </p>
        </div>

        {/* Barra de Controle (Busca e Filtros) */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 sticky top-20 z-30 bg-[#0B0C15]/90 backdrop-blur-xl p-4 border border-white/5 rounded-2xl">
            {/* Input Busca */}
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                <input 
                    type="text" 
                    placeholder="Buscar peças, serviços..." 
                    className="w-full h-12 pl-12 pr-4 bg-[#131525] border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-primary transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filtros Rápidos */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 h-12 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${activeFilter === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30'}`}
                >
                    Todos
                </button>
                <button 
                    onClick={() => setActiveFilter('physical')}
                    className={`px-4 h-12 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${activeFilter === 'physical' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-transparent text-slate-400 border-white/10 hover:border-brand-orange/50'}`}
                >
                    Produtos Físicos
                </button>
                <button 
                    onClick={() => setActiveFilter('service')}
                    className={`px-4 h-12 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${activeFilter === 'service' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-slate-400 border-white/10 hover:border-blue-600/50'}`}
                >
                    Serviços
                </button>
            </div>
        </div>

        {/* Grid de Resultados */}
        <ProductGrid products={filteredProducts} loading={loading} />
      </div>
    </div>
  );
}