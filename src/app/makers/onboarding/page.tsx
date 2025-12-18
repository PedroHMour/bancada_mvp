// src/app/makers/onboarding/page.tsx
"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useMakers } from "@/presentation/hooks/useMakers";
import { MakerCategory } from "@/core/entities/Maker";
import { BaseCard } from "@/presentation/design/components/cards";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { Loader2 } from "lucide-react";

export default function MakerOnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    makerProfile,
    createProfile,
    loading: makerLoading,
    error: makerError,
  } = useMakers();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    businessName: "",
    bio: "",
    categories: [] as MakerCategory[],
    latitude: -3.119028,
    longitude: -60.021731,
  });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user && makerProfile) {
      router.push("/makers/dashboard");
    }
  }, [authLoading, user, makerProfile, router]);

  const handleStep1Next = () => {
    if (!form.businessName.trim()) {
      setLocalError("O nome da bancada é obrigatório.");
      return;
    }
    if (!form.bio.trim()) {
      setLocalError("A bio é obrigatória.");
      return;
    }
    setLocalError("");
    setStep(2);
  };

  const toggleCategory = (cat: MakerCategory) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setLocalError("Usuário não encontrado. Faça login novamente.");
      return;
    }
    if (form.categories.length === 0) {
      setLocalError("Selecione pelo menos uma categoria.");
      return;
    }

    setLocalError("");

    try {
      await createProfile({
        userId: user.id,
        businessName: form.businessName,
        bio: form.bio,
        categories: form.categories,
        latitude: form.latitude,
        longitude: form.longitude,
      });

      router.push("/makers/services"); // Redireciona para cadastro de serviços
    } catch (err: any) {
      setLocalError(makerError || "Erro ao criar perfil de maker.");
    }
  };

  if (authLoading || makerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-main flex items-center justify-center px-6 py-12">
      <BaseCard className="w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-text-primary">
            Crie sua Bancada de Impressão 3D
          </h1>
          <p className="text-text-secondary">
            Em poucos passos você configura seu perfil de Maker e começa a receber pedidos.
          </p>
          <p className="text-sm text-text-muted">Passo {step} de 2</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <BaseInput
              label="Nome da sua bancada"
              placeholder="Ex: 3D Lab Manaus"
              value={form.businessName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, businessName: e.target.value })
              }
              error={localError && !form.businessName.trim() ? localError : undefined}
            />

            <BaseInput
              label="Sobre você (Bio)"
              placeholder="Fale sobre seus serviços, experiência, equipamentos..."
              value={form.bio}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setForm({ ...form, bio: e.target.value })
              }
              isTextArea
              error={localError && !form.bio.trim() ? localError : undefined}
            />

            {localError && !form.businessName.trim() && !form.bio.trim() && (
              <p className="text-red-500 text-sm">{localError}</p>
            )}

            <BaseButton className="w-full" onClick={handleStep1Next}>
              Próximo
            </BaseButton>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text-primary">
              O que você faz?
            </h2>
            <p className="text-sm text-text-secondary">
              Selecione as categorias que melhor descrevem seus serviços.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(MakerCategory).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-3 rounded-xl border text-left text-sm font-medium transition-all duration-200 ${
                    form.categories.includes(cat)
                      ? "bg-brand-primary text-white border-brand-primary shadow-md"
                      : "bg-white text-text-primary border-gray-200 hover:border-brand-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {localError && form.categories.length === 0 && (
              <p className="text-red-500 text-sm">{localError}</p>
            )}

            {makerError && <p className="text-red-500 text-sm">{makerError}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
              <BaseButton
                variant="outline"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Voltar
              </BaseButton>
              <BaseButton
                className="w-full"
                onClick={handleSubmit}
                disabled={makerLoading}
              >
                Finalizar cadastro e ir para serviços
              </BaseButton>
            </div>
          </div>
        )}
      </BaseCard>
    </div>
  );
}
