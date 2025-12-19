"use client";

import { useAuth } from "@/presentation/contexts/AuthContext";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ShoppingBag, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useAuth();

  // Placeholder para lista de pedidos (vazio por enquanto)
  const orders: any[] = []; 

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pedidos</h1>
          <p className="text-slate-400">Acompanhe e gerencie suas vendas em tempo real.</p>
        </div>
        <div className="flex gap-3">
           <BaseButton variant="outline" className="bg-[#131525] border-white/10 text-slate-300 hover:text-white hover:bg-white/5">
              <Filter className="w-4 h-4 mr-2" /> Filtrar
           </BaseButton>
           <BaseButton variant="outline" className="bg-[#131525] border-white/10 text-slate-300 hover:text-white hover:bg-white/5">
              Exportar
           </BaseButton>
        </div>
      </div>

      {/* Barra de Busca Dark */}
      <div className="relative">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
         <input 
            type="text" 
            placeholder="Buscar por cliente, ID do pedido ou produto..." 
            className="w-full bg-[#131525] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary transition-all"
         />
      </div>

      {/* Lista de Pedidos (Estado Vazio) */}
      {orders.length === 0 ? (
        <div className="bg-[#131525] rounded-2xl border border-white/5 p-20 text-center flex flex-col items-center animate-fade-in-up">
           <div className="w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-purple-500/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
             <ShoppingBag size={40} className="text-slate-500" />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Nenhum pedido encontrado</h3>
           <p className="text-slate-400 max-w-md mx-auto mb-8">
             Quando você realizar sua primeira venda, os detalhes aparecerão aqui para você processar.
           </p>
           <Link href="/makers/products">
             <BaseButton className="bg-white text-black hover:bg-slate-200 font-bold border-0">
               Gerenciar Produtos
             </BaseButton>
           </Link>
        </div>
      ) : (
        // Aqui entraria a tabela escura quando tivermos dados
        <div className="bg-[#131525] rounded-2xl border border-white/5 overflow-hidden">
           {/* Tabela Dark entraria aqui */}
        </div>
      )}

    </div>
  );
}