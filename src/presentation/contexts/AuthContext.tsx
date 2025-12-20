"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/infrastructure/supabase/client";
import { useRouter } from "next/navigation";

type UserRole = "client" | "maker";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
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

  // Função auxiliar para extrair o role com segurança
  const getRoleFromUser = (user: User | null): UserRole => {
    if (!user) return "client";
    // Tenta pegar do metadata
    const metaRole = user.user_metadata?.role;
    // Se for válido, retorna. Se não, assume cliente.
    return (metaRole === "maker" || metaRole === "client") ? metaRole : "client";
  };

  useEffect(() => {
    // 1. Verificar sessão inicial
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userRole = getRoleFromUser(session.user);
          setRole(userRole);
        }
      } catch (error) {
        console.error("Erro ao iniciar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 2. Ouvir mudanças em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userRole = getRoleFromUser(session.user);
        setRole(userRole);
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw error;

    if (data.user) {
        const userRole = getRoleFromUser(data.user);
        
        // Força atualização do estado local antes de redirecionar
        setRole(userRole); 
        setUser(data.user);

        if (userRole === 'maker') {
            router.push('/makers/dashboard');
        } else {
            router.push('/'); 
        }
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);