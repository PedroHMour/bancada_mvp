// src/app/makers/profile/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react"; // Importar ChangeEvent
import { BaseButton } from "@/presentation/design/components/buttons"; // Importação corrigida
import { BaseInput } from "@/presentation/design/components/inputs"; // Importação corrigida
import { MakerCategory } from "@/core/entities/Maker";
import { useMakers } from "@/presentation/hooks/useMakers"; // Importação corrigida
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BaseCard } from "@/presentation/design/components/cards"; // Importação corrigida
import { Loader2 } from "lucide-react";

export default function MakerProfileEdit() {
  const { user, loading: authLoading } = useAuth();
  const { makerProfile, updateProfile, loading: makerLoading, error: makerError, fetchMakerData } = useMakers(); // Adicionado fetchMakerData
  const router = useRouter();

  const [form, setForm] = useState({
    businessName: "",
    bio: "",
    categories: [] as MakerCategory[],
    latitude: -3.119028,
    longitude: -60.021731,
  });
  const [localError, setLocalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
    if (!authLoading && user && !makerProfile && !makerLoading && !makerError) {
      router.push("/makers/onboarding");
    }
  }, [user, authLoading, makerProfile, makerLoading, makerError, router]);

  useEffect(() => {
    if (makerProfile) {
      setForm({
        businessName: makerProfile.businessName,
        bio: makerProfile.bio,
        categories: makerProfile.categories,
        latitude: makerProfile.latitude,
        longitude: makerProfile.longitude,
      });
    }
  }, [makerProfile]);

  const toggleCategory = (cat: MakerCategory) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const handleSubmit = async () => {
    if (!makerProfile?.id) {
      setLocalError("Perfil de maker não encontrado.");
      return;
    }
    if (!form.businessName.trim()) {
      setLocalError("O nome da bancada é obrigatório.");
      return;
    }
    if (form.categories.length === 0) {
      setLocalError("Selecione pelo menos uma categoria.");
      return;
    }

    setLocalError("");
    setIsSaving(true);
    try {
      await updateProfile({
        id: makerProfile.id,
        businessName: form.businessName,
        bio: form.bio,
        categories: form.categories,
        latitude: form.latitude,
        longitude: form.longitude,
      });
      alert("Perfil atualizado com sucesso!");
      await fetchMakerData(); // Recarrega os dados após a atualização
      router.push("/makers/dashboard");
    } catch (err: any) {
      setLocalError(makerError || "Erro ao atualizar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || makerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (makerError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main p-6 text-center">
        <BaseCard className="p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Erro ao carregar perfil do Maker</h2>
          <p className="text-gray-700 mb-6">{makerError}</p>
          <BaseButton onClick={() => router.push("/makers/onboarding")}>
            Tentar criar perfil novamente
          </BaseButton>
        </BaseCard>
      </div>
    );
  }

  if (!makerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main p-6 text-center">
        <BaseCard className="p-8">
          <h2 className="text-xl font-semibold mb-4">Você ainda não tem um perfil de Maker.</h2>
          <p className="text-gray-700 mb-6">Crie seu perfil para começar a vender seus serviços e produtos.</p>
          <BaseButton onClick={() => router.push("/makers/onboarding")}>
            Criar Perfil de Maker
          </BaseButton>
        </BaseCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 bg-white rounded-3xl shadow-lg my-12">
      <h1 className="text-3xl font-bold text-center">Editar Perfil</h1>

      <BaseInput
        label="Nome da Bancada"
        value={form.businessName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, businessName: e.target.value })}
        error={localError && !form.businessName.trim() ? localError : undefined}
      />

      <BaseInput
        label="Bio"
        value={form.bio}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, bio: e.target.value })}
        isTextArea
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">Categorias</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.values(MakerCategory).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                form.categories.includes(cat)
                  ? "bg-brand-primary text-white border-brand-primary shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:border-brand-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {localError && form.categories.length === 0 && (
          <p className="text-red-500 text-sm mt-2">{localError}</p>
        )}
      </div>

      <BaseButton onClick={handleSubmit} loading={isSaving} className="w-full">
        Salvar Alterações
      </BaseButton>
      {localError && <p className="text-red-500 text-sm mt-4">{localError}</p>}
    </div>
  );
}
