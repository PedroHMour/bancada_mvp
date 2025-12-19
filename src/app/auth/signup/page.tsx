"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/infrastructure/supabase/client";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ArrowLeft, ArrowRight, Mail, Lock, User, ShoppingBag, Printer, Check, Loader2 } from "lucide-react";

type AccountType = "client" | "maker";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // 1 = Escolha, 2 = Form
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
      // 1. CRIAR LOGIN (AUTH)
      // Gravamos o 'role' nos metadados para saber quem é quem
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
      if (!authData.user) throw new Error("Erro ao gerar usuário.");

      // 2. SE FOR MAKER: CRIAR A BANCADA AGORA (OBRIGATÓRIO)
      if (accountType === "maker") {
        const { error: makerError } = await supabase
          .from("makers")
          .insert({
            user_id: authData.user.id,
            business_name: formData.name, // Usa o nome como nome inicial da bancada
            bio: "Bancada profissional.",
            categories: [],
            verified: false
          });

        // SE FALHAR AQUI, PARAMOS TUDO. NÃO REDIRECIONA.
        if (makerError) {
           console.error("Erro banco:", makerError);
           throw new Error("Erro ao criar sua bancada: " + makerError.message);
        }
      }

      // 3. SE FOR CLIENTE (Opcional: criar perfil de cliente se tiver tabela, senão segue)
      
      // 4. SUCESSO TOTAL -> REDIRECIONAR
      // Só chega aqui se o banco de dados aceitou o registro
      if (accountType === "maker") {
        router.push("/makers/dashboard");
      } else {
        router.push("/marketplace");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro. Verifique seus dados.");
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
                ? "Como você quer usar a plataforma?" 
                : accountType === "maker" 
                  ? "Crie sua conta Profissional. Sua bancada será ativada imediatamente."
                  : "Crie sua conta de Cliente para começar a comprar."
              }
            </p>
          </div>
        </div>

        {/* Lado Direito (Interação) */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
          
          {step === 1 ? (
            // PASSO 1: ESCOLHA OBRIGATÓRIA
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-slate-900">Escolha seu perfil</h2>
              
              <div className="grid gap-4">
                <button
                  onClick={() => setAccountType("client")}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 group flex items-start gap-4 ${
                    accountType === "client" ? "border-brand-primary bg-brand-light/30" : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    accountType === "client" ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${accountType === "client" ? "text-brand-primary" : "text-slate-700"}`}>
                      Sou Cliente
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Quero comprar peças ou contratar serviços.</p>
                  </div>
                  {accountType === "client" && <div className="absolute top-4 right-4 text-brand-primary"><Check size={20}/></div>}
                </button>

                <button
                  onClick={() => setAccountType("maker")}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 group flex items-start gap-4 ${
                    accountType === "maker" ? "border-brand-primary bg-brand-light/30" : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    accountType === "maker" ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    <Printer size={24} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${accountType === "maker" ? "text-brand-primary" : "text-slate-700"}`}>
                      Sou Maker
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Quero vender e gerenciar minha produção.</p>
                  </div>
                  {accountType === "maker" && <div className="absolute top-4 right-4 text-brand-primary"><Check size={20}/></div>}
                </button>
              </div>

              <BaseButton onClick={() => setStep(2)} className="w-full h-14 text-lg font-bold mt-4 shadow-lg shadow-brand-primary/20">
                Continuar como {accountType === "maker" ? "Maker" : "Cliente"} <ArrowRight className="ml-2 w-5 h-5"/>
              </BaseButton>
            </div>
          ) : (
            // PASSO 2: FORMULÁRIO FINAL
            <div className="space-y-6 animate-fade-in-up">
              <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-2">
                <ArrowLeft size={14} /> Alterar perfil
              </button>
              
              <h2 className="text-2xl font-bold text-slate-900">
                Cadastro de {accountType === "maker" ? "Maker" : "Cliente"}
              </h2>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">Nome Completo</label>
                  <div className="relative">
                    <BaseInput 
                      placeholder={accountType === "maker" ? "Nome do seu Negócio" : "Seu Nome"}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-11 h-12 bg-slate-50 border-slate-200"
                      required
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">E-mail</label>
                  <div className="relative">
                    <BaseInput 
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-11 h-12 bg-slate-50 border-slate-200"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">Senha</label>
                  <div className="relative">
                    <BaseInput 
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-11 h-12 bg-slate-50 border-slate-200"
                      required
                      minLength={6}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                <BaseButton 
                  type="submit" 
                  loading={loading}
                  className="w-full h-14 text-lg font-bold shadow-lg shadow-brand-primary/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin"/> Criando Bancada...</span>
                  ) : (
                    "Finalizar Cadastro"
                  )}
                </BaseButton>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}