// src/app/makers/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useMakers } from "@/presentation/hooks/useMakers";
import { BaseCard } from "@/presentation/design/components/cards";
import { BaseButton } from "@/presentation/design/components/buttons";
import { Loader2, MapPin, Star, Settings, Wrench, Wallet } from "lucide-react";

export default function MakerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { makerProfile, loading: makerLoading, error, fetchMakerData } = useMakers();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      fetchMakerData();
    }
  }, [authLoading, user, fetchMakerData]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user && !makerLoading && !error) {
      if (!makerProfile) {
        router.push("/makers/onboarding");
      }
    }
  }, [authLoading, user, makerLoading, makerProfile, error, router]);

  if (authLoading || makerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main p-6 text-center">
        <BaseCard className="p-8 max-w-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Erro ao carregar seu painel de Maker
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <BaseButton onClick={() => fetchMakerData()}>
            Tentar novamente
          </BaseButton>
        </BaseCard>
      </div>
    );
  }

  if (!makerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">
        Olá, {makerProfile.businessName}
      </h1>
      <p className="text-text-secondary">
        Aqui você gerencia sua bancada, seus serviços e seus pedidos.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <BaseCard className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            Reputação
          </h2>
          <p className="text-3xl font-bold text-text-primary">
            {makerProfile.rating.toFixed(1)}
          </p>
          <p className="text-sm text-text-secondary">
            {makerProfile.totalOrders} pedidos concluídos
          </p>
        </BaseCard>

        <BaseCard className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-brand-primary" />
            Serviços
          </h2>
          <p className="text-sm text-text-secondary">
            Cadastre e gerencie os serviços que você oferece.
          </p>
          <BaseButton
            className="w-full mt-2"
            onClick={() => router.push("/makers/services")}
          >
            Gerenciar serviços
          </BaseButton>
        </BaseCard>

        <BaseCard className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" />
            Dados bancários
          </h2>
          <p className="text-sm text-text-secondary">
            Configure como você recebe pelos pedidos.
          </p>
          <BaseButton
            variant="outline"
            className="w-full mt-2"
            onClick={() => router.push("/makers/bank")}
          >
            Configurar conta
          </BaseButton>
        </BaseCard>
      </div>

      <BaseCard className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5 text-text-primary" />
          Perfil público
        </h2>
        <p className="text-sm text-text-secondary">
          Esse é o perfil que os clientes veem no marketplace.
        </p>
        <div className="flex flex-wrap gap-3">
          <BaseButton
            variant="outline"
            onClick={() => router.push("/makers/profile")}
          >
            Editar perfil
          </BaseButton>
          <BaseButton
            variant="ghost"
            onClick={() => router.push(`/makers/${makerProfile.id}`)}
          >
            Ver como cliente
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  );
}
