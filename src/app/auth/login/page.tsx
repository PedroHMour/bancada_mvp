"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/infrastructure/supabase/client";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ArrowLeft, Mail, Lock, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const role = data.user?.user_metadata?.role;
      if (role === "maker") {
        router.push("/makers/dashboard");
      } else {
        router.push("/marketplace");
      }

    } catch (err) {
      console.error(err); // Usa a variável para o ESLint não reclamar
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none opacity-40"></div>

      <div className="w-full max-w-5xl bg-[#131525] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] relative z-10">
        
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#0F101B] to-[#0B0C15] p-8 md:p-12 text-white flex flex-col justify-between relative border-r border-white/5">
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
              <ArrowLeft size={16} /> Voltar para Home
            </Link>
            
            <div className="mb-8">
               <Image 
                 src="/logo-white.png" 
                 alt="Bancada" 
                 width={160} 
                 height={50} 
                 className="h-10 w-auto mb-6"
                 priority
               />
               <h1 className="text-3xl font-bold mb-4">Bem-vindo de volta.</h1>
               <p className="text-slate-400 leading-relaxed">
                 Acesse sua conta para gerenciar seus pedidos.
               </p>
            </div>
          </div>
          
          <div className="relative z-10">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Bancada Inc.</p>
          </div>
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-[#131525]">
          <div className="max-w-sm mx-auto w-full">
            
            <div className="text-center md:text-left mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Acesse sua conta</h2>
                <p className="text-slate-400 text-sm">Escolha uma opção para entrar.</p>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold h-12 rounded-xl hover:bg-slate-200 transition-colors mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar com Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#131525] px-2 text-slate-500">Ou entre com e-mail</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">E-mail</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Mail size={20} /></div>
                  <BaseInput 
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-12 h-12 bg-[#0B0C15] border-white/10 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Senha</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Lock size={20} /></div>
                  <BaseInput 
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-12 h-12 bg-[#0B0C15] border-white/10 text-white"
                    required
                  />
                </div>
                <div className="flex justify-end">
                    <Link href="#" className="text-xs text-brand-primary hover:text-brand-hover hover:underline">
                        Esqueceu a senha?
                    </Link>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>{error}
                </div>
              )}

              <BaseButton type="submit" loading={loading} className="w-full h-12 text-base font-bold shadow-lg shadow-brand-primary/20 bg-brand-primary hover:bg-brand-hover text-white border-0">
                {loading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2 w-5 h-5"/> Entrar</>}
              </BaseButton>

              <div className="text-center text-sm text-slate-500 pt-4">
                Não tem uma conta? <Link href="/auth/signup" className="text-brand-primary font-bold hover:underline">Cadastre-se</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}