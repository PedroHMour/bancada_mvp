"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Printer } from "lucide-react";
import { useAuth } from "@/presentation/contexts/AuthContext";

export default function MakerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const menuItems = [
    { label: "Visão Geral", href: "/makers/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Catálogo", href: "/makers/products", icon: <Package size={20} /> },
    { label: "Vendas", href: "/makers/orders", icon: <ShoppingBag size={20} /> },
    { label: "Configurações", href: "/makers/settings", icon: <Settings size={20} /> },
  ];

  return (
    // PT-24: Garante que o conteúdo comece APÓS a navbar fixa
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24 md:flex-row">
      
      {/* SIDEBAR FIXA (Desktop) */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 md:fixed md:left-0 md:top-24 md:h-[calc(100vh-6rem)] z-40 overflow-y-auto">
        <div className="p-6">
          <h2 className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Gestão do Studio
          </h2>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? "bg-brand-primary/10 text-brand-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-slate-100 pt-4">
             <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors">
               <LogOut size={20} /> Sair
             </button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO (Com margem para respeitar a sidebar) */}
      <main className="flex-1 md:ml-64 p-6 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}