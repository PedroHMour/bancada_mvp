// src/app/marketplace/page.tsx
"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useMakers } from "@/presentation/hooks/useMakers";
import { Maker, MakerCategory } from "@/core/entities/Maker";
import { Loader2, Search, X } from "lucide-react";
import { BaseCard } from "@/presentation/design/components/cards";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main p-6 text-center">
        <BaseCard className="p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Erro ao carregar makers</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <BaseButton onClick={() => window.location.reload()}>Tentar novamente</BaseButton>
        </BaseCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-primary">
          Descubra Bancadas de Impressão 3D
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Encontre os melhores makers perto de você e transforme suas ideias em realidade.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
        {/* Busca por nome */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Buscar por nome
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Digite o nome da bancada..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Filtro por categoria */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Filtrar por categoria
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.values(MakerCategory).map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(selectedCategory === category ? null : category)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-brand-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Botão limpar filtros */}
        {(searchTerm || selectedCategory) && (
          <BaseButton
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar filtros
          </BaseButton>
        )}
      </div>

      {/* Resultados */}
      {filteredMakers.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-3xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700">
            Nenhum maker encontrado.
          </h2>
          <p className="text-gray-500 mt-2">
            Tente ajustar seus filtros ou buscar por outro termo.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-text-secondary mb-6">
            {filteredMakers.length} maker{filteredMakers.length !== 1 ? "s" : ""} encontrado{filteredMakers.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMakers.map((maker) => (
              <Link key={maker.id} href={`/makers/${maker.id}`}>
                <BaseCard hover className="h-full flex flex-col cursor-pointer">
                  {/* Imagem */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                    <Image
                      src="https://placehold.co/600x400/E8E8FE/6C6CF2?text=Maker"
                      alt={`Avatar de ${maker.businessName}`}
                      fill
                      className="object-cover"
                      unoptimized={true} // <<-- GARANTINDO unoptimized AQUI
                    />
                  </div>

                  {/* Conteúdo */}
                  <h2 className="text-xl font-semibold text-text-primary mb-2 line-clamp-1">
                    {maker.businessName}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                    {maker.bio || "Nenhuma descrição disponível."}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{maker.rating.toFixed(1)} ({maker.totalOrders} pedidos)</span>
                  </div>

                  {/* Categorias */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {maker.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-brand-light text-brand-primary px-3 py-1 rounded-full text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </BaseCard>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
