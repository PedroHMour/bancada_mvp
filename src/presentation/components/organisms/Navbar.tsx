"use client";

import Link from "next/link";
import Image from "next/image"; // Importante para a logo
import { useAuth } from "@/presentation/contexts/AuthContext";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ShoppingCart, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0B0C15]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="container-custom mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO (Substituindo o texto) */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
           <Image 
             src="/logo-white.png" 
             alt="Bancada" 
             width={140} 
             height={40} 
             className="h-8 w-auto object-contain" // Garante que a logo não distorça
             priority
           />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {/* Aumentei o contraste do texto para slate-300 (mais claro que o padrão) */}
          <Link href="/marketplace" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Explorar
          </Link>
          <Link href="/makers/products/new" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sou Maker
          </Link>
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/cart">
                <button className="p-2 text-slate-300 hover:text-brand-primary hover:bg-white/5 rounded-full transition-all">
                  <ShoppingCart size={20} />
                </button>
              </Link>
              
              <div className="flex items-center gap-3 pl-2">
                <Link href={user.user_metadata.role === 'maker' ? "/makers/dashboard" : "/profile"}>
                   <div className="flex items-center gap-2 text-sm font-medium text-white hover:text-brand-primary cursor-pointer transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-tr from-brand-primary to-purple-600 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border border-white/10">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:block max-w-[100px] truncate text-slate-200">
                        {user.user_metadata.full_name?.split(' ')[0]}
                      </span>
                   </div>
                </Link>
                <button 
                  onClick={signOut} 
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-sm font-bold text-white hover:text-brand-primary transition-colors">
                Entrar
              </Link>
              <Link href="/auth/signup">
                <BaseButton size="sm" className="bg-white text-black hover:bg-slate-200 border-0 font-bold px-6">
                  Criar Conta
                </BaseButton>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-slate-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0B0C15] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-fade-in-up">
          <Link href="/marketplace" className="text-slate-200 font-medium py-2 border-b border-white/5">Explorar Produtos</Link>
          <Link href="/auth/signup" className="text-slate-200 font-medium py-2 border-b border-white/5">Seja um Maker</Link>
          {!user && (
             <div className="flex flex-col gap-3 mt-2">
               <Link href="/auth/login" className="w-full text-center py-3 text-slate-300 font-bold border border-white/10 rounded-xl">Entrar</Link>
               <Link href="/auth/signup" className="w-full">
                 <BaseButton className="w-full justify-center bg-brand-primary text-white border-0">Criar Conta</BaseButton>
               </Link>
             </div>
          )}
        </div>
      )}
    </nav>
  );
};