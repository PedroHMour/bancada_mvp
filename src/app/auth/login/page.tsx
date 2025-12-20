"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { supabase } from "@/infrastructure/supabase/client";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) throw loginError;
      
      router.push("/");
    } catch (err: unknown) {
       if (err instanceof Error) {
         setError(err.message);
       } else {
         setError("Falha ao entrar. Verifique suas credenciais.");
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B0C15]">
      
      {/* LADO ESQUERDO - VISUAL */}
      <div className="hidden lg:flex w-1/2 relative bg-[#050810] items-center justify-center overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-brand-dark/50 z-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="relative z-20 max-w-md text-center px-12">
          <div className="w-24 h-24 bg-brand-orange/10 rounded-2xl border border-brand-orange/20 flex items-center justify-center mx-auto mb-8 rotate-3">
             <Image src="/logo.png" alt="Bancada" width={60} height={60} className="opacity-80 invert" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Bem-vindo de volta à Bancada.</h2>
          <p className="text-slate-400 leading-relaxed">
            Sua oficina digital está pronta. Continue seus projetos ou gerencie suas vendas.
          </p>
        </div>
      </div>

      {/* LADO DIREITO - FORMULÁRIO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative">
        <Link href="/" className="absolute top-8 left-8 text-slate-500 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={18} /> Voltar
        </Link>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-white mb-2">Entrar na conta</h1>
            <p className="text-slate-400 text-sm">Digite seus dados para acessar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <BaseInput
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail size={18} />}
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
              required
            />

            <div className="space-y-1">
              <BaseInput
                label="Senha"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}
                required
              />
              <div className="flex justify-end">
                <Link href="/auth/reset-password" className="text-xs text-brand-orange hover:text-brand-orange-hover font-medium">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <BaseButton type="submit" className="w-full" size="lg" isLoading={loading}>
              Entrar
            </BaseButton>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0B0C15] px-2 text-slate-500">Ou continue com</span></div>
          </div>

          <button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold h-12 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Não tem uma conta?{" "}
            <Link href="/auth/signup" className="text-white hover:text-brand-orange font-bold transition-colors">
              Crie agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}