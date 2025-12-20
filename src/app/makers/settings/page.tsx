"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../presentation/contexts/AuthContext";
import { useMakers } from "../../../presentation/hooks/useMakers";
import { BaseInput } from "../../../presentation/design/components/inputs";
import { BaseButton } from "../../../presentation/design/components/buttons";
import { Save, User, MapPin, CreditCard, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { makerProfile, fetchMakerData, updateProfile, loading } = useMakers();
  const [saving, setSaving] = useState(false);

  // Estado local para formulário
  const [formData, setFormData] = useState({
    businessName: "",
    bio: "",
    pixKey: "",
  });

  useEffect(() => {
    if (user && !makerProfile) fetchMakerData();
  }, [user, makerProfile, fetchMakerData]);

  useEffect(() => {
    if (makerProfile) {
      setFormData({
        businessName: makerProfile.businessName || "",
        bio: makerProfile.bio || "",
        pixKey: "", // Se tivesse no makerProfile, carregaria aqui
      });
    }
  }, [makerProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        businessName: formData.businessName,
        bio: formData.bio,
      });
      alert("Configurações salvas com sucesso!");
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !makerProfile) {
    return <div className="min-h-[50vh] flex justify-center items-center"><Loader2 className="animate-spin text-brand-primary"/></div>;
  }

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações da Bancada</h1>
        <p className="text-slate-400">Gerencie as informações públicas do seu perfil e dados de recebimento.</p>
      </div>

      {/* Seção: Perfil Público */}
      <section className="bg-[#131525] rounded-2xl border border-white/5 overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
           <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
             <User size={20} />
           </div>
           <h2 className="text-lg font-bold text-white">Perfil Público</h2>
        </div>
        
        <div className="p-8 space-y-6">
           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-300">Nome da Bancada</label>
                 <BaseInput 
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="bg-[#0B0C15] border-white/10 text-white focus:border-brand-primary"
                 />
                 <p className="text-xs text-slate-500">Este é o nome que aparecerá para os clientes.</p>
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-300">E-mail de Contato</label>
                 <BaseInput 
                    value={user?.email || ""}
                    disabled
                    className="bg-[#0B0C15]/50 border-white/5 text-slate-500 cursor-not-allowed"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Bio / Sobre</label>
              <textarea 
                className="w-full h-32 bg-[#0B0C15] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Conte um pouco sobre suas máquinas e experiência..."
              />
           </div>
        </div>
      </section>

      {/* Seção: Endereço (Visual) */}
      <section className="bg-[#131525] rounded-2xl border border-white/5 overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
           <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
             <MapPin size={20} />
           </div>
           <h2 className="text-lg font-bold text-white">Localização</h2>
        </div>
        <div className="p-8">
           <p className="text-slate-400 text-sm mb-4">A localização é usada para calcular o frete e mostrar makers próximos aos clientes.</p>
           <div className="flex items-center gap-4">
              <BaseInput placeholder="CEP" className="max-w-[150px] bg-[#0B0C15] border-white/10 text-white"/>
              <BaseButton variant="outline" className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5">Buscar</BaseButton>
           </div>
        </div>
      </section>

      {/* Seção: Financeiro (Visual) */}
      <section className="bg-[#131525] rounded-2xl border border-white/5 overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
           <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
             <CreditCard size={20} />
           </div>
           <h2 className="text-lg font-bold text-white">Dados de Recebimento</h2>
        </div>
        <div className="p-8">
           <div className="space-y-2 max-w-md">
              <label className="text-sm font-bold text-slate-300">Chave PIX</label>
              <BaseInput 
                placeholder="CPF, E-mail ou Aleatória" 
                value={formData.pixKey}
                onChange={(e) => setFormData({...formData, pixKey: e.target.value})}
                className="bg-[#0B0C15] border-white/10 text-white focus:border-green-500/50"
              />
           </div>
        </div>
      </section>

      {/* Botão Salvar Flutuante ou Fixo */}
      <div className="flex justify-end pt-4">
        <BaseButton 
            onClick={handleSave} 
            loading={saving} 
            size="lg" 
            className="bg-white text-black hover:bg-slate-200 border-0 font-bold px-8 shadow-xl shadow-white/5"
        >
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
        </BaseButton>
      </div>

    </div>
  );
}