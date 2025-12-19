"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useMakers } from "@/presentation/hooks/useMakers";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { User, CreditCard, Building, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { makerProfile, bankAccount, fetchMakerData, updateProfile, upsertBankAccount, loading } = useMakers();
  const [activeTab, setActiveTab] = useState<"profile" | "bank">("profile");

  const [profileForm, setProfileForm] = useState({ name: "", bio: "", tags: "" });
  const [bankForm, setBankForm] = useState({ holder: "", cpfCnpj: "", bankCode: "", agency: "", accNumber: "", pix: "" });

  useEffect(() => {
    if (user && !makerProfile) fetchMakerData();
  }, [user, makerProfile, fetchMakerData]);

  useEffect(() => {
    if (makerProfile) {
      setProfileForm({
        name: makerProfile.businessName,
        bio: makerProfile.bio || "",
        tags: makerProfile.categories.join(", "),
      });
    }
    if (bankAccount) {
      setBankForm({
        holder: bankAccount.holderName,
        cpfCnpj: bankAccount.cpfOrCnpj,
        bankCode: bankAccount.bankCode,
        agency: bankAccount.agency,
        accNumber: bankAccount.accountNumber,
        pix: bankAccount.pixKey || "",
      });
    }
  }, [makerProfile, bankAccount]);

  const handleSaveProfile = async () => {
    if (!makerProfile) return;
    try {
      await updateProfile({
        id: makerProfile.id,
        businessName: profileForm.name,
        bio: profileForm.bio,
        categories: profileForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      });
      alert("Perfil atualizado!");
    } catch (e) {
      alert("Erro ao salvar perfil.");
    }
  };

  const handleSaveBank = async () => {
    if (!makerProfile) return;
    try {
      await upsertBankAccount({
        holderName: bankForm.holder,
        cpfOrCnpj: bankForm.cpfCnpj,
        bankCode: bankForm.bankCode,
        agency: bankForm.agency,
        accountNumber: bankForm.accNumber,
        pixKey: bankForm.pix,
      });
      alert("Dados bancários salvos!");
    } catch (e) {
      alert("Erro ao salvar banco.");
    }
  };

  if (!makerProfile && loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Configurações</h1>
      <p className="text-slate-500 mb-8">Gerencie os dados da sua bancada e formas de recebimento.</p>

      {/* ABAS */}
      <div className="flex gap-4 border-b border-slate-200 mb-8">
        <button onClick={() => setActiveTab("profile")} className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500'}`}><User size={18} /> Dados da Bancada</button>
        <button onClick={() => setActiveTab("bank")} className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'bank' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500'}`}><CreditCard size={18} /> Dados Bancários</button>
      </div>

      {/* CONTEÚDO */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Nome do Studio</label><BaseInput value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} /></div>
               <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Tags (Separadas por vírgula)</label><BaseInput value={profileForm.tags} onChange={e => setProfileForm({...profileForm, tags: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Bio / Sobre</label><textarea className="w-full h-32 p-4 rounded-xl border border-slate-200 outline-none focus:border-brand-primary" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} /></div>
            <div className="pt-4 flex justify-end"><BaseButton onClick={handleSaveProfile} loading={loading}><Save className="w-4 h-4 mr-2" /> Salvar Alterações</BaseButton></div>
          </div>
        )}

        {activeTab === "bank" && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6"><p className="text-sm text-blue-800 flex items-center gap-2"><Building size={16}/> Dados para recebimento automático.</p></div>
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Titular</label><BaseInput value={bankForm.holder} onChange={e => setBankForm({...bankForm, holder: e.target.value})} /></div>
               <div className="space-y-2"><label className="text-sm font-bold text-slate-700">CPF/CNPJ</label><BaseInput value={bankForm.cpfCnpj} onChange={e => setBankForm({...bankForm, cpfCnpj: e.target.value})} /></div>
               <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Cód. Banco</label><BaseInput value={bankForm.bankCode} onChange={e => setBankForm({...bankForm, bankCode: e.target.value})} /></div>
               <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Agência</label><BaseInput value={bankForm.agency} onChange={e => setBankForm({...bankForm, agency: e.target.value})} /></div>
               <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Conta</label><BaseInput value={bankForm.accNumber} onChange={e => setBankForm({...bankForm, accNumber: e.target.value})} /></div>
               <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Chave Pix</label><BaseInput value={bankForm.pix} onChange={e => setBankForm({...bankForm, pix: e.target.value})} /></div>
            </div>
            <div className="pt-4 flex justify-end"><BaseButton onClick={handleSaveBank} loading={loading}><Save className="w-4 h-4 mr-2" /> Salvar Dados</BaseButton></div>
          </div>
        )}
      </div>
    </div>
  );
}