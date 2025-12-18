// src/app/makers/[id]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMakers } from "@/presentation/hooks/useMakers";
import { Maker, MakerService } from "@/core/entities/Maker";
import { BaseCard } from "@/presentation/design/components/cards";
import { BaseButton } from "@/presentation/design/components/buttons";
import { Loader2, Star } from "lucide-react";
import Image from "next/image"; // Importar Image

export default function MakerPublicProfile() {
  const pathname = usePathname();
  const router = useRouter();
  const makerId = pathname.split("/").pop(); // Extrai o ID da URL

  const { getMakerById } = useMakers(); // Usamos apenas a função de busca

  const [maker, setMaker] = useState<Maker | null>(null);
  const [services, setServices] = useState<MakerService[]>([]);
  const [pageLoading, setPageLoading] = useState(true); // Estado de loading local da página
  const [pageError, setPageError] = useState<string | null>(null); // Estado de erro local da página

  // Função para buscar os dados do maker, memoizada com useCallback
  const fetchMakerData = useCallback(async (id: string) => {
    setPageLoading(true);
    setPageError(null);
    try {
      const fetchedMaker = await getMakerById(id); // Chama a função do hook

      if (!fetchedMaker) {
        setPageError("Maker não encontrado.");
        setMaker(null);
        setServices([]);
        return;
      }

      // Normaliza valores para evitar crash (null -> defaults)
      const safeMaker: Maker = {
        ...fetchedMaker,
        rating: fetchedMaker.rating ?? 0,
        totalOrders: fetchedMaker.totalOrders ?? 0,
        categories: fetchedMaker.categories ?? [],
        services: fetchedMaker.services ?? [],
      };

      setMaker(safeMaker);
      setServices(safeMaker.services);
    } catch (err: any) {
      console.error("MakerPublicProfile: Erro em fetchMakerData", err); // Log explícito
      setPageError(err.message || "Erro desconhecido ao carregar perfil.");
    } finally {
      setPageLoading(false);
    }
  }, [getMakerById]); // Dependências do useCallback: apenas a função do hook

  // O useEffect agora depende apenas do makerId e da função memoizada fetchMakerData
  useEffect(() => {
    if (makerId) { // Garante que só tenta buscar se o ID existe
      fetchMakerData(makerId);
    } else {
      // Se makerId não existe na URL, redireciona imediatamente
      console.warn("ID do Maker não encontrado na URL. Redirecionando para o marketplace.");
      router.replace("/marketplace");
    }
  }, [makerId, fetchMakerData, router]); // Dependências: makerId, fetchMakerData (memoizada), router

  // --- Renderização de estados de carregamento/erro ---
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main p-6 text-center">
        <BaseCard className="p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Erro ao carregar perfil</h2>
          <p className="text-gray-700 mb-6">{pageError}</p>
          <BaseButton onClick={() => router.replace("/marketplace")}>Voltar ao Marketplace</BaseButton>
        </BaseCard>
      </div>
    );
  }

  if (!maker) { // Este caso deve ser coberto por pageError se getMakerById retornar null
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main p-6 text-center">
        <BaseCard className="p-8">
          <h2 className="text-xl font-semibold mb-4">Maker não encontrado</h2>
          <p className="text-gray-700">O perfil que você procura não existe ou foi removido.</p>
          <BaseButton onClick={() => router.replace("/marketplace")} className="mt-4">
            Voltar ao Marketplace
          </BaseButton>
        </BaseCard>
      </div>
    );
  }

  // --- Renderização do perfil do maker ---
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      {/* Cabeçalho do maker */}
      <BaseCard className="p-8 space-y-4">
        {/* Placeholder para avatar do maker, substituir por maker.avatar_url quando implementado */}
        <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden mx-auto mb-4">
          <Image
            src="https://placehold.co/200x200/E8E8FE/6C6CF2?text=Maker"
            alt={`Avatar de ${maker.businessName}`}
            fill
            className="object-cover"
            unoptimized={true} // <<-- GARANTINDO unoptimized AQUI TAMBÉM
          />
        </div>

        <h1 className="text-3xl font-bold text-text-primary text-center">
          {maker.businessName}
        </h1>
        <p className="text-gray-700 text-base text-center">
          {maker.bio || "Este maker ainda não adicionou uma descrição."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">
              {(maker.rating ?? 0).toFixed(1)}
            </span>
            <span className="text-gray-500">
              ({maker.totalOrders ?? 0} pedidos)
            </span>
          </div>

          {maker.categories && maker.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {maker.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-brand-light text-brand-primary px-3 py-1 rounded-full text-xs"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </BaseCard>

      {/* Lista de serviços */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text-primary text-center">
          Serviços disponíveis
        </h2>

        {services.length === 0 ? (
          <BaseCard className="p-6 text-center">
            <p className="text-gray-600">
              Este maker ainda não cadastrou nenhum serviço.
            </p>
          </BaseCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <BaseCard key={s.id} className="p-6 space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  {s.name}
                </h3>
                {s.description && (
                  <p className="text-sm text-gray-600">{s.description}</p>
                )}
                {typeof s.price === "number" && (
                  <p className="text-brand-primary font-bold text-lg">
                    R$ {s.price.toFixed(2)}
                  </p>
                )}
              </BaseCard>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <BaseButton
          variant="outline"
          onClick={() => router.replace("/marketplace")}
        >
          ← Voltar ao Marketplace
        </BaseButton>
      </div>
    </div>
  );
}
