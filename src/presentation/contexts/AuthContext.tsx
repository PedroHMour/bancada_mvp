// src/presentation/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client"; // Correção do import
import { useRouter } from "next/navigation";
import { UserRole } from "@/types"; // Import do novo tipo

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, pass: string, role: UserRole, extraData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper para extrair role
  const getRoleFromUser = (user: User | null): UserRole => {
    if (!user) return "client";
    const metaRole = user.user_metadata?.role;
    return (metaRole === "maker" || metaRole === "client") ? metaRole : "client";
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) setRole(getRoleFromUser(session.user));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) setRole(getRoleFromUser(session.user));
      else setRole(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    
    if (data.user) {
        const userRole = getRoleFromUser(data.user);
        setRole(userRole); 
        setUser(data.user);
        router.push(userRole === 'maker' ? '/makers/dashboard' : '/'); 
    }
  };

  const signUp = async (email: string, pass: string, role: UserRole, extraData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { role, ...extraData },
      },
    });
    if (error) throw error;
    router.push('/auth/login?registered=true');
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signInWithGoogle, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);