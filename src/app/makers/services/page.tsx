// src/app/makers/services/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { BaseCard } from "@/presentation/design/components/cards";
import { BaseButton } from "@/presentation/design/components/buttons";
import { BaseInput } from "@/presentation/design/components/inputs";
import { useMakers } from "@/presentation/hooks/useMakers";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { MakerService } from "@/core/entities/Maker";

export default function MakerServices() {
  const { user, loading: authLoading } = useAuth();
  const { makerProfile, makerServices, loading: makerLoading, error: makerError, addService, updateService, deleteService, fetchMakerData } = useMakers();
  const router = useRouter();

  const [newServiceForm, setNewServiceForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [localError, setLocalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
    if (!authLoading && user && !makerProfile && !makerLoading && !makerError) {
      router.push("/makers/onboarding"); // Se não tem maker, vai para onboarding
    }
  }, [user, authLoading, makerProfile, makerLoading, makerError, router]);

  const handleAddService = async () => {
    if (!makerProfile?.id) {
      setLocalError("Perfil de maker não encontrado.");
      return;
    }
    if (!newServiceForm.name.trim() || !newServiceForm.price.trim()) {
      setLocalError("Nome e preço do serviço são obrigatórios.");
      return;
    }

    setLocalError("");
    setIsSaving(true);
    try {
      await addService({
        makerId: makerProfile.id,
        name: newServiceForm.name,
        description: newServiceForm.description,
        price: parseFloat(newServiceForm.price),
      });
      setNewServiceForm({ name: "", description: "", price: "" });
      alert("Serviço adicionado com sucesso!");
      await fetchMakerData(); // Recarrega os dados do maker após adicionar
    } catch (err: any) {
      setLocalError(makerError || "Erro ao adicionar serviço.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (serviceId: string) => {
    const serviceToEdit = makerServices.find(s => s.id === serviceId);
    if (serviceToEdit) {
      setNewServiceForm({
        name: serviceToEdit.name,
        description: serviceToEdit.description || "",
        price: serviceToEdit.price?.toString() || "",
      });
      setEditingServiceId(serviceId);
    }
  };

  const handleUpdateService = async () => {
    if (!editingServiceId) return;
    if (!newServiceForm.name.trim() || !newServiceForm.price.trim()) {
      setLocalError("Nome e preço do serviço são obrigatórios.");
      return;
    }

    setLocalError("");
    setIsSaving(true);
    try {
      await updateService({
        id: editingServiceId,
        name: newServiceForm.name,
        description: newServiceForm.description,
        price: parseFloat(newServiceForm.price),
      });
      setNewServiceForm({ name: "", description: "", price: "" });
      setEditingServiceId(null);
      alert("Serviço atualizado com sucesso!");
      await fetchMakerData(); // Recarrega os dados do maker após atualizar
    } catch (err: any) {
      setLocalError(makerError || "Erro ao atualizar serviço.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      setIsSaving(true);
      try {
        await deleteService(serviceId);
        alert("Serviço excluído com sucesso!");
        await fetchMakerData(); // Recarrega os dados do maker após excluir
      } catch (err: any) {
        setLocalError(makerError || "Erro ao excluir serviço.");
      } finally {
        setIsSaving(false);
      }
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
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 bg-white rounded-3xl shadow-lg my-12">
      <h1 className="text-3xl font-bold text-center">Gerenciar Serviços</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Seus Serviços Atuais</h2>
        {makerServices.length === 0 ? (
          <p className="text-gray-600">Nenhum serviço cadastrado ainda.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {makerServices.map((s: MakerService) => (
              <BaseCard key={s.id} className="p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  {s.description && <p className="text-gray-600 text-sm mt-1 line-clamp-2">{s.description}</p>}
                  <p className="text-brand-primary text-xl font-bold mt-2">
                    R$ {s.price?.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <BaseButton variant="outline" size="sm" onClick={() => handleEditClick(s.id)}>
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </BaseButton>
                  <BaseButton variant="danger" size="sm" onClick={() => handleDeleteService(s.id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Excluir
                  </BaseButton>
                </div>
              </BaseCard>
            ))}
          </div>
        )}
      </div>

      <div className="pt-10 border-t border-gray-200 space-y-6">
        <h2 className="text-xl font-semibold">{editingServiceId ? "Editar Serviço" : "Adicionar Novo Serviço"}</h2>

        <BaseInput
          label="Nome do Serviço"
          value={newServiceForm.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
          error={localError && !newServiceForm.name.trim() ? localError : undefined}
        />

        <BaseInput
          label="Descrição (opcional)"
          value={newServiceForm.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
          isTextArea
        />

        <BaseInput
          label="Preço (R$)"
          type="number"
          step="0.01"
          value={newServiceForm.price}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewServiceForm({ ...newServiceForm, price: e.target.value })}
          error={localError && !newServiceForm.price.trim() ? localError : undefined}
        />

        {localError && <p className="text-red-500 text-sm">{localError}</p>}

        <BaseButton
          className="w-full mt-4"
          onClick={editingServiceId ? handleUpdateService : handleAddService}
          loading={isSaving}
        >
          {editingServiceId ? "Salvar Alterações" : <><Plus className="w-5 h-5 mr-2" /> Adicionar Serviço</>}
        </BaseButton>
        {editingServiceId && (
          <BaseButton variant="outline" className="w-full mt-2" onClick={() => {
            setEditingServiceId(null);
            setNewServiceForm({ name: "", description: "", price: "" });
            setLocalError("");
          }}>
            Cancelar Edição
          </BaseButton>
        )}
      </div>
    </div>
  );
}
