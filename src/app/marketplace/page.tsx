// src/app/marketplace/page.tsx
"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useMakers } from "@/presentation/hooks/useMakers";
import { Maker, MakerCategory } from "@/core/entities/Maker";
import { Loader2, Search, X, Star, Filter, MapPin } from "lucide-react";
import { BaseCard } from "@/presentation/design/components/cards";
import { BaseButton } from "@/presentation/design/components/buttons";
import Image from "next/image";
import Link from "next/link";

export default function MarketplacePage() {
  const { getAllMakers, loading, error } = useMakers();
  const [makers, setMakers] = useState<Maker[]>([]);
  const [filteredMakers, setFilteredMakers] = useState<Maker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MakerCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMakers() {
      setIsLoading(true);
      try {
        const fetchedMakers = await getAllMakers();
        setMakers(fetchedMakers);
        setFilteredMakers(fetchedMakers);
      } catch (err: any) {
        console.error("Erro ao carregar makers:", err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMakers();
  }, [getAllMakers]);

  useEffect(() => {
    let result = makers;

    if (selectedCategory) {
      result = result.filter((maker) =>
        maker.categories.includes(selectedCategory)
      );
    }

    if (searchTerm.trim()) {
      result = result.filter((maker) =>
        maker.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maker.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMakers(result);
  }, [searchTerm, selectedCategory, makers]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0C15] pt-20">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
           <p className="text-slate-400 animate-pulse text-sm">Sincronizando makers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0C15] pt-20 p-6 text-center">
        <div className="p-8 max-w-md w-full border border-red-900/50 rounded-2xl bg-red-950/20 backdrop-blur-sm">
          <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
             <X size={24}/>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Erro de conexão</h2>
          <p className="text-slate-400 mb-6 text-sm">{error}</p>
          <BaseButton onClick={() => window.location.reload()} variant="outline" className="w-full border-red-800 text-red-400 hover:bg-red-900/20">
            Reconectar
          </BaseButton>
        </div>
      </div>
    );
  }

  return (
    // DARK MODE BACKGROUND (#0B0C15)
    // pt-32: Garante que o conteúdo não fique escondido atrás da Navbar Fixa
    <div className="min-h-screen bg-[#0B0C15] pt-32 pb-20">
      
      {/* Background Glow Effects (Ambientação) */}
      <div className="fixed top-20 left-0 w-full h-[500px] bg-brand-primary/5 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 space-y-10 relative z-10">
        
        {/* Header da Página */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Marketplace
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl font-light">
              Conecte-se aos melhores <span className="text-brand-primary font-medium">Makers Profissionais</span> e tire seu projeto do papel.
            </p>
          </div>
          <div className="text-right hidden md:block">
             <span className="text-xs font-bold text-brand-light bg-white/5 border border-white/10 px-4 py-2 rounded-full uppercase tracking-wider">
               {filteredMakers.length} bancadas online
             </span>
          </div>
        </div>

        {/* Área de Filtros e Busca (Dark Glass) */}
        <div className="bg-[#131525]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-6 shadow-xl">
          <div className="grid md:grid-cols-12 gap-6">
            
            {/* Busca por Texto */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-3 h-3" /> Buscar
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Nome do maker, especialidade..."
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-[#0B0C15] border border-white/10 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-medium text-slate-200 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Filtro de Categorias */}
            <div className="md:col-span-7 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-3 h-3" /> Filtrar por
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(MakerCategory).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      selectedCategory === category
                        ? "bg-brand-primary border-brand-primary text-white shadow-[0_0_15px_-3px_#6C6CF2]"
                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
                
                {/* Botão Limpar */}
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors ml-auto border border-transparent"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Resultados */}
        {filteredMakers.length === 0 ? (
          <div className="text-center py-24 bg-[#131525]/50 rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
               <Search size={32} />
            </div>
            <h2 className="text-xl font-bold text-white">Nenhum maker encontrado</h2>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Não encontramos resultados para sua busca. Tente ajustar os filtros.
            </p>
            <BaseButton 
              variant="ghost" 
              className="mt-6 text-brand-primary hover:bg-white/5"
              onClick={handleClearFilters}
            >
              Limpar filtros
            </BaseButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMakers.map((maker) => (
              <Link key={maker.id} href={`/makers/${maker.id}`} className="group h-full">
                <article className="h-full flex flex-col bg-[#131525] rounded-2xl border border-white/10 overflow-hidden hover:border-brand-primary/50 hover:shadow-[0_0_30px_-10px_rgba(108,108,242,0.3)] transition-all duration-300 group-hover:-translate-y-1">
                  
                  {/* Imagem do Card */}
                  <div className="relative w-full h-56 bg-slate-900 overflow-hidden">
                    {/* Overlay gradiente para legibilidade se tiver texto na imagem */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131525] to-transparent opacity-60 z-10"></div>
                    
                    <Image
                      src="https://placehold.co/600x400/1E293B/94A3B8?text=Maker+Space"
                      alt={`Avatar de ${maker.businessName}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      unoptimized={true}
                    />
                    
                    {/* Badge de Rating */}
                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white border border-white/10 flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {maker.rating.toFixed(1)}
                    </div>
                  </div>

                  {/* Corpo do Card */}
                  <div className="p-6 flex flex-col flex-grow relative z-20 -mt-2">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-white mb-1 group-hover:text-brand-primary transition-colors line-clamp-1">
                        {maker.businessName}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                         <MapPin size={12}/>
                         <span>São Paulo, SP</span> {/* Placeholder de localização */}
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px] font-light">
                        {maker.bio || "Maker pronto para imprimir seu projeto com qualidade e precisão."}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                       <div className="flex flex-wrap gap-1.5">
                          {maker.categories.slice(0, 2).map((cat, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-white/5 border border-white/5 px-2 py-1 rounded">
                              {cat}
                            </span>
                          ))}
                          {maker.categories.length > 2 && (
                             <span className="text-[10px] font-bold text-slate-500 px-1 py-1">+ {maker.categories.length - 2}</span>
                          )}
                       </div>
                       <div className="text-xs font-bold text-brand-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                          VISITAR
                       </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}