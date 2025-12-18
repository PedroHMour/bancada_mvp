"use client";

import { useState } from "react";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUp(email, password);
      router.push("/makers/onboarding");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Criar Conta</h1>

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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <BaseButton type="submit" loading={loading} className="w-full">
            Cadastrar
          </BaseButton>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-brand-primary font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
