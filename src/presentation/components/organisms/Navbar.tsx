"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, LogOut, LayoutDashboard, Menu, X, Package, BarChart3, PlusCircle } from "lucide-react";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useCart } from "@/presentation/hooks/useCart";
import { useRouter } from "next/navigation";
import { BaseButton } from "@/presentation/design/components/buttons";
import { useState, useEffect } from "react";

export function Navbar() {
  const { user, role, signOut, loading: authLoading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 border-b ${
        scrolled 
          ? "h-20 bg-[#0B0C15]/90 backdrop-blur-xl border-white/10 shadow-2xl" 
          : "h-24 bg-[#0B0C15]/50 backdrop-blur-sm border-white/5"
      }`}
    >
      <div className="container-custom h-full flex justify-between items-center relative">
        
        {/* LOGO */}
        <Link href={role === "maker" ? "/makers/dashboard" : "/"} className="flex items-center gap-3 group shrink-0">
          <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/logo-white.png"
              alt="Bancada"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
            Bancada <span className="text-xs font-normal text-slate-400 align-top">{role === 'maker' ? 'PRO' : ''}</span>
          </span>
        </Link>

        {/* NAVEGAÇÃO DINÂMICA */}
        {!authLoading && (
          <div className="hidden md:flex items-center gap-8">
            {user && role === "maker" ? (
              // MENU DE MAKER
              <>
                <NavLink href="/makers/dashboard">Visão Geral</NavLink>
                <NavLink href="/makers/products">Catálogo</NavLink>
                <NavLink href="/makers/orders">Vendas</NavLink>
              </>
            ) : (
              // MENU DE CLIENTE / VISITANTE
              <>
                <NavLink href="/marketplace">Marketplace</NavLink>
                {user && <NavLink href="/client/orders">Minhas Compras</NavLink>}
              </>
            )}
          </div>
        )}

        {/* ACTIONS AREA */}
        <div className="flex items-center gap-4">
          
          {/* Botão Novo Produto (Só Maker) */}
          {user && role === "maker" && (
            <Link href="/makers/products/new">
              <BaseButton size="sm" className="hidden sm:flex bg-brand-primary hover:bg-brand-hover border-0 text-white shadow-lg shadow-brand-primary/20 rounded-full h-9 px-4">
                <PlusCircle className="w-4 h-4 mr-2" /> Novo Item
              </BaseButton>
            </Link>
          )}

          {/* Carrinho (Não aparece para Maker) */}
          {role !== "maker" && (
            <Link href="/cart">
              <button className="relative p-2.5 text-slate-300 hover:text-white transition-colors group bg-white/5 rounded-full hover:bg-white/10">
                <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
                {cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#0B0C15]">
                    {cart.items.length}
                  </span>
                )}
              </button>
            </Link>
          )}

          {/* Login / Logout */}
          {!authLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="text-right hidden lg:block">
                     <p className="text-xs text-slate-400">Conta</p>
                     <p className="text-sm font-bold text-white leading-none max-w-[100px] truncate">
                       {user.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}
                     </p>
                  </div>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors p-2" title="Sair">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
                    Entrar
                  </Link>
                  <Link href="/auth/signup">
                    <BaseButton variant="primary" className="rounded-xl h-10 px-6 text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 border-0 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all">
                      Criar Conta
                    </BaseButton>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group py-2">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#6C6CF2]"></span>
    </Link>
  );
}