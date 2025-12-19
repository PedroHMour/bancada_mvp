"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";
import { useProducts } from "@/presentation/hooks/useProducts";
import { ProductGrid } from "@/presentation/components/organisms/ProductGrid";
import { Product } from "@/core/entities/Product";

export default function MarketplacePage() {
  const { products, loading, fetchAllProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Categorias definidas
  const categories = ["Todos", "Action Figures", "Peças Técnicas", "Decoração", "Cosplay", "Serviços"];

  // Carrega tudo ao iniciar
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Lógica de Filtragem
  useEffect(() => {
    if (products) {
        let result = products;

        // 1. Filtro por Categoria (Provisório via texto até termos campo 'category' no banco)
        if (selectedCategory !== "Todos") {
            result = result.filter(p => {
                const term = selectedCategory.toLowerCase();
                // Procura no nome ou descrição
                const textMatch = 
                    p.name.toLowerCase().includes(term) || 
                    p.description?.toLowerCase().includes(term);
                
                // Se for Serviços, verifica o tipo também
                const typeMatch = selectedCategory === "Serviços" && p.type === "service";
                
                return textMatch || typeMatch;
            });
        }

        // 2. Filtro por Busca da Barra
        if (searchTerm) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(result);
    }
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0B0C15] pt-32 pb-20 px-6">
       
       <div className="container-custom mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Explore a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-500">Bancada</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative flex items-center">
             <div className="absolute left-4 text-slate-500">
                <Search size={22} />
             </div>
             <input 
                type="text"
                placeholder="O que procura? (ex: Goku, Suporte, Engrenagem)"
                className="w-full h-14 pl-14 pr-4 bg-[#131525] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary transition-all shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
       </div>

       <div className="container-custom mx-auto">
          {/* Menu de Categorias */}
          <div className="flex gap-2 overflow-x-auto pb-8 justify-center mb-4 custom-scrollbar-hidden">
             {categories.map((cat) => (
                <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${
                        selectedCategory === cat
                        ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" 
                        : "bg-[#131525] text-slate-400 border-white/5 hover:border-white/20 hover:text-white"
                    }`}
                >
                    {cat}
                </button>
             ))}
          </div>

          {filteredProducts.length === 0 && !loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-500 opacity-60">
                 <PackageX size={64} className="mb-4 text-slate-700"/>
                 <h3 className="text-xl font-bold text-slate-400">Nenhum produto encontrado.</h3>
                 <p>Tente mudar a categoria ou o termo de busca.</p>
             </div>
          ) : (
             <ProductGrid products={filteredProducts} loading={loading} />
          )}
       </div>

    </div>
  );
}