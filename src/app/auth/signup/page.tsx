"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/infrastructure/supabase/client";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ArrowLeft, ArrowRight, Mail, Lock, User, ShoppingBag, Printer, Check } from "lucide-react";

type AccountType = "client" | "maker";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType>("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Criar Usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: accountType,
          },
        },
      });

      if (authError) throw authError;

      // 2. AUTO-CRIAÇÃO DE PERFIL MAKER
      if (accountType === "maker" && authData.user) {
        // Tenta criar o perfil imediatamente para evitar o "Perfil não encontrado"
        const { error: makerError } = await supabase
          .from("makers")
          .insert({
            user_id: authData.user.id,
            business_name: formData.name, // Usa o nome pessoal como temporário
            bio: "Bancada criada recentemente.",
            categories: [],
            verified: false
          });
        
        if (makerError) {
           console.error("Aviso: Perfil automático falhou (pode já existir):", makerError);
        }
      }

      // 3. Redirecionamento
      if (accountType === "maker") {
        router.push("/makers/dashboard");
      } else {
        router.push("/marketplace");
      }

    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">
        {/* Lado Esquerdo (Visual) */}
        <div className="w-full md:w-5/12 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
              <ArrowLeft size={16} /> Voltar
            </Link>
            <h1 className="text-3xl font-bold mb-4">Bem-vindo à Bancada.</h1>
            <p className="text-slate-400">
              {step === 1 
                ? "Escolha como você deseja participar do nosso ecossistema." 
                : accountType === "maker" 
                  ? "Crie sua conta profissional e acesse seu painel imediatamente."
                  : "Crie sua conta para encomendar peças exclusivas."
              }
            </p>
          </div>
        </div>

        {/* Lado Direito (Formulário) */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
          {step === 1 ? (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-slate-900">Qual seu objetivo?</h2>
              <div className="grid gap-4">
                <button onClick={() => setAccountType("client")} className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 group flex items-start gap-4 ${accountType === "client" ? "border-brand-primary bg-brand-light/30" : "border-slate-100 hover:border-slate-300"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${accountType === "client" ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-500"}`}><ShoppingBag size={24} /></div>
                  <div><h3 className={`font-bold text-lg ${accountType === "client" ? "text-brand-primary" : "text-slate-700"}`}>Quero Comprar</h3><p className="text-sm text-slate-500 mt-1">Busco serviços de impressão 3D.</p></div>
                  {accountType === "client" && <div className="absolute top-4 right-4 text-brand-primary"><Check size={20}/></div>}
                </button>
                <button onClick={() => setAccountType("maker")} className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 group flex items-start gap-4 ${accountType === "maker" ? "border-brand-primary bg-brand-light/30" : "border-slate-100 hover:border-slate-300"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${accountType === "maker" ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-500"}`}><Printer size={24} /></div>
                  <div><h3 className={`font-bold text-lg ${accountType === "maker" ? "text-brand-primary" : "text-slate-700"}`}>Sou Maker</h3><p className="text-sm text-slate-500 mt-1">Quero vender serviços e produtos.</p></div>
                  {accountType === "maker" && <div className="absolute top-4 right-4 text-brand-primary"><Check size={20}/></div>}
                </button>
              </div>
              <BaseButton onClick={() => setStep(2)} className="w-full h-14 text-lg font-bold mt-4 shadow-lg shadow-brand-primary/20">Continuar como {accountType === "maker" ? "Maker" : "Cliente"} <ArrowRight className="ml-2 w-5 h-5"/></BaseButton>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in-up">
              <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Alterar tipo</button>
              <h2 className="text-2xl font-bold text-slate-900">Criar conta {accountType === "maker" ? "Profissional" : "Pessoal"}</h2>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1"><label className="text-sm font-bold text-slate-700 ml-1">Nome Completo</label><div className="relative"><BaseInput placeholder={accountType === "maker" ? "Nome da sua Bancada" : "Seu nome"} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="pl-11 h-12 bg-slate-50 border-slate-200" required /><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /></div></div>
                <div className="space-y-1"><label className="text-sm font-bold text-slate-700 ml-1">E-mail</label><div className="relative"><BaseInput type="email" placeholder="seu@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="pl-11 h-12 bg-slate-50 border-slate-200" required /><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /></div></div>
                <div className="space-y-1"><label className="text-sm font-bold text-slate-700 ml-1">Senha</label><div className="relative"><BaseInput type="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="pl-11 h-12 bg-slate-50 border-slate-200" required minLength={6} /><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /></div></div>
                {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">{error}</div>}
                <BaseButton type="submit" loading={loading} className="w-full h-14 text-lg font-bold shadow-lg shadow-brand-primary/20">Criar Conta e Acessar</BaseButton>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}