"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/infrastructure/supabase/client";
import { useRouter } from "next/navigation";

type UserRole = "client" | "maker";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null; // Novo campo para saber o tipo de usuário
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Ler o papel dos metadados do usuário
      const userRole = session?.user?.user_metadata?.role as UserRole;
      setRole(userRole || "client"); // Default para cliente se não tiver role
      setLoading(false);
    });

    // 2. Ouvir mudanças (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      const userRole = session?.user?.user_metadata?.role as UserRole;
      setRole(userRole || "client");
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // Importante: No Google, não conseguimos forçar o metadata 'role' antes do login.
        // O ideal é tratar isso no callback ou perguntar depois.
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);