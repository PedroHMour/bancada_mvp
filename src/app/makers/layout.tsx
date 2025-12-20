"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, PlusCircle } from "lucide-react";
import { BaseButton } from "../../presentation/design/components/buttons";

export default function MakerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/makers/dashboard" },
    { icon: Package, label: "Meus Produtos", href: "/makers/products" },
    { icon: ShoppingBag, label: "Pedidos", href: "/makers/orders" },
    { icon: Settings, label: "Configurações", href: "/makers/settings" },
  ];

  return (
    // min-h-screen garante que o fundo cubra tudo
    // pt-20: Compensa a Navbar fixa do RootLayout
    <div className="min-h-screen bg-[#0B0C15] pt-20 flex">
      
      {/* SIDEBAR STICKY 
        - sticky top-20: Cola no topo (abaixo da navbar)
        - h-[calc(100vh-80px)]: Ocupa a altura da tela menos a navbar
        - Isso evita que ela desça infinitamente sobre o Footer
      */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#131525] border-r border-white/5 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto z-30">
        
        <div className="p-6">
          <Link href="/makers/products/new">
            <BaseButton className="w-full bg-brand-primary hover:bg-brand-hover text-white shadow-lg shadow-brand-primary/20 border-0 font-bold">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Item
            </BaseButton>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}>
                  <item.icon size={20} className={isActive ? "text-brand-primary" : "text-slate-500 group-hover:text-white transition-colors"} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-gradient-to-br from-purple-900/20 to-brand-primary/10 rounded-xl p-4 border border-white/5">
             <p className="text-xs font-bold text-white mb-1">Nível Maker</p>
             <div className="w-full bg-black/50 h-1.5 rounded-full mb-2 overflow-hidden">
                <div className="bg-gradient-to-r from-brand-primary to-purple-500 w-[70%] h-full rounded-full"></div>
             </div>
             <p className="text-[10px] text-slate-400">70% para o próximo nível</p>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-8 overflow-hidden">
         {/* Container para limitar a largura em telas muito grandes */}
         <div className="max-w-6xl mx-auto animate-fade-in-up">
            {children}
         </div>
      </main>
      
    </div>
  );
}