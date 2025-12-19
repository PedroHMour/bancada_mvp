"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/infrastructure/supabase/client";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // VERIFICAÇÃO DE PAPEL (ROLE)
      // O 'role' foi gravado no signup e agora orienta o redirecionamento
      const role = data.user?.user_metadata?.role;

      if (role === "maker") {
        router.push("/makers/dashboard");
      } else {
        router.push("/marketplace");
      }

    } catch (err: any) {
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[550px]">
        {/* Lado Esquerdo */}
        <div className="w-full md:w-5/12 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
              <ArrowLeft size={16} /> Voltar
            </Link>
            <h1 className="text-3xl font-bold mb-4">Bem-vindo de volta.</h1>
            <p className="text-slate-400">Entre para gerenciar sua bancada ou acompanhar seus pedidos.</p>
          </div>
        </div>

        {/* Lado Direito */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="space-y-6 max-w-sm mx-auto w-full">
            <h2 className="text-2xl font-bold text-slate-900">Acesse sua conta</h2>
            
            <form onSubmit={handleLogin} className="space-y-5">
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
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-11 h-12 bg-slate-50 border-slate-200"
                    required
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
                className="w-full h-12 text-lg font-bold shadow-lg shadow-brand-primary/20"
              >
                Entrar <LogIn className="ml-2 w-5 h-5"/>
              </BaseButton>

              <div className="text-center text-sm text-slate-500 pt-2">
                Não tem uma conta?{" "}
                <Link href="/auth/signup" className="text-brand-primary font-bold hover:underline">
                  Cadastre-se
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}