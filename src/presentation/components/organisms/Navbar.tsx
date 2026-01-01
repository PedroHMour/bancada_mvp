"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ShoppingCart, LogOut, Menu, X, Settings, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  // ADIÇÃO: Pegamos o 'loading' do contexto
  const { user, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isMaker = user?.user_metadata?.role === 'maker';

  // Componente de Loading (Skeleton) para evitar pulo de layout
  const AuthLoadingSkeleton = () => (
    <div className="flex items-center gap-4 animate-pulse">
      <div className="w-8 h-8 bg-white/10 rounded-full"></div>
      <div className="hidden md:block w-24 h-8 bg-white/10 rounded-lg"></div>
    </div>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${scrolled
            ? "bg-brand-dark/95 backdrop-blur-md border-white/10 shadow-lg"
            : "bg-transparent border-transparent"
          }`}
      >
        <div className="container-custom mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"  // <--- AQUI: Define o ficheiro da imagem
              alt="Bancada"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <NavLink href="/marketplace" active={pathname === "/marketplace"}>Explorar</NavLink>

              {/* Lógica Inteligente: Se estiver carregando, esconde. Se for Client logado, esconde. Se Maker ou Deslogado, mostra. */}
              {!loading && (!user || isMaker) && (
                <NavLink href={user ? "/makers/dashboard" : "/auth/signup"} active={pathname.includes("/makers")}>
                  Área Maker
                </NavLink>
              )}
            </nav>

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {/* ÁREA DE AUTH (CORRIGIDA) */}
            {loading ? (
              <AuthLoadingSkeleton />
            ) : user ? (
              // ESTADO 1: LOGADO
              <div className="flex items-center gap-4 animate-in fade-in duration-300">
                <Link href="/cart" className="relative group">
                  <button className="p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all">
                    <ShoppingCart size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full"></span>
                  </button>
                </Link>

                <div className="flex items-center gap-3 pl-2">
                  <Link href={isMaker ? "/makers/dashboard" : "/profile"}>
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="w-8 h-8 bg-brand-petrol-light rounded-md flex items-center justify-center text-xs font-bold text-brand-orange border border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-200 leading-none mb-0.5">
                          {user.user_metadata.full_name?.split(' ')[0] || 'Usuário'}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold group-hover:text-brand-orange transition-colors">
                          {isMaker ? 'Maker Pro' : 'Cliente'}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={signOut}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    title="Sair"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              // ESTADO 2: NÃO LOGADO
              <div className="flex items-center gap-4 animate-in fade-in duration-300">
                <Link href="/auth/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                  Entrar
                </Link>
                <Link href="/auth/signup">
                  <BaseButton size="sm" variant="primary">
                    Criar Conta
                  </BaseButton>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden p-2 text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark pt-24 px-6 md:hidden overflow-y-auto animate-in slide-in-from-top-10 duration-200">
          <div className="flex flex-col gap-2">

            <MobileNavLink href="/marketplace" icon={<Box size={20} />}>Explorar Marketplace</MobileNavLink>

            {/* Link Inteligente Mobile */}
            <MobileNavLink href={user ? (isMaker ? "/makers/dashboard" : "/profile") : "/auth/signup"} icon={<Settings size={20} />}>
              {loading ? "Carregando..." : (user ? (isMaker ? "Painel do Maker" : "Minha Conta") : "Seja um Maker")}
            </MobileNavLink>

            <div className="h-px bg-white/5 my-4"></div>

            {loading ? (
              <div className="flex justify-center p-4"><AuthLoadingSkeleton /></div>
            ) : !user ? (
              <div className="flex flex-col gap-3">
                <Link href="/auth/login" className="w-full">
                  <BaseButton variant="secondary" className="w-full justify-center">Entrar</BaseButton>
                </Link>
                <Link href="/auth/signup" className="w-full">
                  <BaseButton className="w-full justify-center">Criar Conta Grátis</BaseButton>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/cart" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 text-slate-200">
                  <ShoppingCart size={20} className="text-brand-orange" />
                  <span className="font-bold">Meu Carrinho</span>
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors w-full text-left mt-2"
                >
                  <LogOut size={20} />
                  <span className="font-bold">Sair da Conta</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const NavLink = ({ href, children, active }: { href: string, children: React.ReactNode, active?: boolean }) => (
  <Link
    href={href}
    className={`text-sm font-bold transition-colors relative py-1 group ${active ? "text-brand-orange" : "text-slate-400 hover:text-white"
      }`}
  >
    {children}
    <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-orange transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"
      }`}></span>
  </Link>
);

const MobileNavLink = ({ href, children, icon }: { href: string, children: React.ReactNode, icon?: React.ReactNode }) => (
  <Link href={href} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white font-medium border border-transparent hover:border-white/5 transition-all">
    {icon && <span className="text-brand-concrete">{icon}</span>}
    {children}
  </Link>
);