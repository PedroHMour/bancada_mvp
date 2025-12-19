"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// useRouter removido pois não estava sendo usado
import { supabase } from "@/infrastructure/supabase/client";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ArrowLeft, ArrowRight, Mail, Lock, User, ShoppingBag, Printer, Check, Loader2, MailCheck } from "lucide-react";

type AccountType = "client" | "maker";

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType>("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: accountType, 
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      });

      if (authError) throw authError;

      if (accountType === "maker" && data.user) {
        await supabase.from("makers").insert({
            user_id: data.user.id,
            business_name: formData.name,
            bio: "Perfil em aprovação.",
            categories: [],
            verified: false
        });
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Erro ao criar conta. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#131525] border border-white/5 rounded-3xl p-8 text-center animate-fade-in-up">
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
             <MailCheck size={40} />
           </div>
           <h2 className="text-2xl font-bold text-white mb-4">Verifique seu e-mail</h2>
           <p className="text-slate-400 mb-8">
             Enviamos um link de confirmação para <strong>{formData.email}</strong>.
           </p>
           <Link href="/auth/login"><BaseButton className="w-full bg-white text-black hover:bg-slate-200 border-0 font-bold">Voltar para Login</BaseButton></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-[#131525] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[650px] relative z-10">
        
        {/* Lado Esquerdo */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#0F101B] to-[#0B0C15] p-8 md:p-12 text-white flex flex-col justify-between border-r border-white/5 relative">
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"><ArrowLeft size={16} /> Voltar</Link>
            <Image src="/logo-white.png" alt="Bancada" width={140} height={40} className="h-8 w-auto mb-8" priority />
            <h1 className="text-3xl font-bold mb-4">Junte-se à revolução.</h1>
            <p className="text-slate-400">{step === 1 ? "Escolha como você deseja participar." : "Preencha seus dados para finalizar."}</p>
          </div>
          <div className="relative z-10 flex gap-2 mt-8">
             <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-brand-primary' : 'bg-white/10'}`}></div>
             <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-brand-primary' : 'bg-white/10'}`}></div>
          </div>
        </div>

        {/* Lado Direito */}
        <div className="w-full md:w-7/12 p-8 md:p-16 bg-[#131525] flex flex-col justify-center">
          
          {step === 1 ? (
            <div className="space-y-8 animate-fade-in-up">
              <div><h2 className="text-2xl font-bold text-white mb-2">Qual seu objetivo?</h2><p className="text-slate-400 text-sm">Selecione o tipo de perfil.</p></div>
              
              <div className="grid gap-4">
                <button onClick={() => setAccountType("client")} className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group flex items-start gap-4 ${accountType === "client" ? "border-brand-primary bg-brand-primary/10" : "border-white/5 bg-[#0B0C15] hover:border-white/20"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${accountType === "client" ? "bg-brand-primary text-white" : "bg-[#131525] text-slate-500 border border-white/10"}`}><ShoppingBag size={24} /></div>
                  <div><h3 className={`font-bold text-lg ${accountType === "client" ? "text-white" : "text-slate-300"}`}>Sou Cliente</h3><p className="text-sm text-slate-500 mt-1">Quero comprar peças.</p></div>
                  {accountType === "client" && <div className="absolute top-4 right-4 text-brand-primary"><Check size={20}/></div>}
                </button>

                <button onClick={() => setAccountType("maker")} className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group flex items-start gap-4 ${accountType === "maker" ? "border-brand-primary bg-brand-primary/10" : "border-white/5 bg-[#0B0C15] hover:border-white/20"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${accountType === "maker" ? "bg-brand-primary text-white" : "bg-[#131525] text-slate-500 border border-white/10"}`}><Printer size={24} /></div>
                  <div><h3 className={`font-bold text-lg ${accountType === "maker" ? "text-white" : "text-slate-300"}`}>Sou Maker</h3><p className="text-sm text-slate-500 mt-1">Quero vender serviços.</p></div>
                  {accountType === "maker" && <div className="absolute top-4 right-4 text-brand-primary"><Check size={20}/></div>}
                </button>
              </div>
              
              <div className="relative py-2">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                 <div className="relative flex justify-center"><span className="bg-[#131525] px-2 text-xs text-slate-500">OU</span></div>
              </div>
              
              <button onClick={handleGoogleSignup} className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold h-12 rounded-xl hover:bg-slate-200 transition-colors text-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Cadastro Rápido com Google
              </button>

              <BaseButton onClick={() => setStep(2)} className="w-full h-14 text-base font-bold mt-2 shadow-lg bg-brand-primary hover:bg-brand-hover text-white border-0">Continuar com E-mail <ArrowRight className="ml-2 w-5 h-5"/></BaseButton>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in-up">
              <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-4 transition-colors"><ArrowLeft size={14} /> Alterar perfil</button>
              <div><h2 className="text-2xl font-bold text-white mb-2">Criar conta</h2><p className="text-slate-400 text-sm">Preencha seus dados.</p></div>
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2"><label className="text-sm font-bold text-slate-300 ml-1">Nome</label><BaseInput placeholder="Seu Nome" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[#0B0C15] border-white/10 text-white" required /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-300 ml-1">E-mail</label><BaseInput type="email" placeholder="email@exemplo.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-[#0B0C15] border-white/10 text-white" required /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-300 ml-1">Senha</label><BaseInput type="password" placeholder="******" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-[#0B0C15] border-white/10 text-white" required minLength={6} /></div>
                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">{error}</div>}
                <BaseButton type="submit" loading={loading} className="w-full h-12 text-base font-bold bg-brand-primary hover:bg-brand-hover text-white border-0">{loading ? "Criando..." : "Finalizar"}</BaseButton>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}