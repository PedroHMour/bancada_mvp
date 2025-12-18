// src/app/makers/bank/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react"; // Importar ChangeEvent
import { BaseInput } from "@/presentation/design/components/inputs"; // Importação corrigida
import { BaseButton } from "@/presentation/design/components/buttons"; // Importação corrigida
import { useMakers } from "@/presentation/hooks/useMakers"; // Importação corrigida
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BaseCard } from "@/presentation/design/components/cards"; // Importação corrigida

export default function MakerBank() {
  const { user, loading: authLoading } = useAuth();
  const { makerProfile, bankAccount, loading: makerLoading, error: makerError, upsertBankAccount, fetchMakerData } = useMakers(); // Adicionado fetchMakerData
  const router = useRouter();

  const [form, setForm] = useState({
    holderName: "",
    cpfOrCnpj: "",
    bankCode: "",
    agency: "",
    accountNumber: "",
    pixKey: "",
  });
  const [localError, setLocalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
    // Se não tem perfil de maker, redireciona para onboarding
    if (!authLoading && user && !makerProfile && !makerLoading && !makerError) {
      router.push("/makers/onboarding");
    }
  }, [user, authLoading, makerProfile, makerLoading, makerError, router]);

  useEffect(() => {
    if (bankAccount) {
      setForm({
        holderName: bankAccount.holderName,
        cpfOrCnpj: bankAccount.cpfOrCnpj,
        bankCode: bankAccount.bankCode,
        agency: bankAccount.agency,
        accountNumber: bankAccount.accountNumber,
        pixKey: bankAccount.pixKey || "",
      });
    }
  }, [bankAccount]);

  const handleSubmit = async () => {
    if (!makerProfile?.id) {
      setLocalError("Perfil de maker não encontrado para salvar dados bancários.");
      return;
    }
    if (!form.holderName.trim() || !form.cpfOrCnpj.trim() || !form.bankCode.trim() || !form.agency.trim() || !form.accountNumber.trim()) {
      setLocalError("Todos os campos obrigatórios devem ser preenchidos.");
      return;
    }

    setLocalError("");
    setIsSaving(true);
    try {
      await upsertBankAccount(form);
      alert("Dados bancários salvos com sucesso!");
      await fetchMakerData(); // Recarrega os dados do maker após salvar
      router.push("/makers/dashboard");
    } catch (err: any) {
      setLocalError(makerError || "Erro ao salvar dados bancários.");
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
      <h1 className="text-3xl font-bold text-center">Dados Bancários</h1>

      <BaseInput
        label="Nome do Titular"
        value={form.holderName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, holderName: e.target.value })}
        error={localError && !form.holderName.trim() ? localError : undefined}
      />

      <BaseInput
        label="CPF/CNPJ"
        value={form.cpfOrCnpj}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, cpfOrCnpj: e.target.value })}
        error={localError && !form.cpfOrCnpj.trim() ? localError : undefined}
      />

      <BaseInput
        label="Código do Banco"
        value={form.bankCode}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, bankCode: e.target.value })}
        error={localError && !form.bankCode.trim() ? localError : undefined}
      />

      <BaseInput
        label="Agência"
        value={form.agency}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, agency: e.target.value })}
        error={localError && !form.agency.trim() ? localError : undefined}
      />

      <BaseInput
        label="Número da Conta"
        value={form.accountNumber}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, accountNumber: e.target.value })}
        error={localError && !form.accountNumber.trim() ? localError : undefined}
      />

      <BaseInput
        label="Chave Pix (opcional)"
        value={form.pixKey}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, pixKey: e.target.value })}
      />

      {localError && <p className="text-red-500 text-sm mt-4">{localError}</p>}

      <BaseButton onClick={handleSubmit} loading={isSaving} className="w-full mt-4">
        Salvar Dados Bancários
      </BaseButton>
    </div>
  );
}
