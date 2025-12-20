"use client";

import Link from "next/link";
import { useAuth } from "@/presentation/contexts/AuthContext"; // Import corrigido
import { BaseButton } from "@/presentation/design/components/buttons";
import { ShoppingCart, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B0C15]/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold text-black">
            B
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Bancada</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/marketplace" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Explorar Peças
          </Link>
          <Link href="/makers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Encontrar Makers
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {role === 'client' && (
                 <Link href="/cart">
                    <BaseButton variant="ghost" size="sm" className="relative">
                        <ShoppingCart size={20} />
                        {/* Badge de contador pode vir aqui futuramente */}
                    </BaseButton>
                 </Link>
              )}
              
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-white leading-none">{user.user_metadata?.full_name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-brand-primary uppercase font-bold">{role === 'maker' ? 'Maker' : 'Cliente'}</p>
                </div>
                
                {role === 'maker' ? (
                     <Link href="/makers/dashboard">
                        <BaseButton size="sm">Dashboard</BaseButton>
                     </Link>
                ) : (
                    <BaseButton variant="ghost" size="sm" onClick={() => signOut()}>
                        <LogOut size={18}/>
                    </BaseButton>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <BaseButton variant="ghost" size="sm">Entrar</BaseButton>
              </Link>
              <Link href="/auth/signup">
                <BaseButton size="sm">Criar Conta</BaseButton>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0B0C15] border-b border-white/5 p-4 space-y-4">
          <Link href="/marketplace" className="block text-slate-300 py-2">Explorar</Link>
          <Link href="/makers" className="block text-slate-300 py-2">Makers</Link>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
             {!user ? (
                <>
                    <Link href="/auth/login" className="w-full">
                        <BaseButton variant="outline" className="w-full justify-center">Entrar</BaseButton>
                    </Link>
                    <Link href="/auth/signup" className="w-full">
                        <BaseButton className="w-full justify-center">Criar Conta</BaseButton>
                    </Link>
                </>
             ) : (
                <BaseButton variant="ghost" onClick={() => signOut()} className="w-full justify-start text-red-400">
                    Sair da Conta
                </BaseButton>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}