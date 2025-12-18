// src/app/auth/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { BaseCard } from "@/presentation/design/components/cards";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push("/marketplace"); // Redireciona para o marketplace se já estiver logado
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await signIn(email, password);
      // O redirecionamento será tratado pelo useEffect acima
    } catch (err: any) {
      setLocalError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main p-6">
      <BaseCard className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-text-primary">Entrar</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BaseInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <BaseInput
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {localError && <p className="text-accent-red text-sm text-center">{localError}</p>}
          <BaseButton type="submit" className="w-full" loading={loading}>
            Entrar
          </BaseButton>
        </form>
        <p className="text-center text-text-secondary">
          Não tem uma conta?{" "}
          <Link href="/auth/signup" className="text-brand-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </BaseCard>
    </div>
  );
}
