"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useProducts } from "@/presentation/hooks/useProducts"; 
import { useMakers } from "@/presentation/hooks/useMakers";     
import { BaseButton } from "@/presentation/design/components/buttons";
import { 
  Plus, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Printer, 
  Box,
  ShoppingBag
} from "lucide-react";

// Interfaces
interface Order {
  id: string;
  product: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  value: number;
}

interface MakerStats {
  totalSales: number;
  activeOrders: number;
  rating: number;
}

export default function MakerDashboard() {
  const { user } = useAuth();
  
  const { makerProfile, fetchMakerData, loading: makerLoading } = useMakers();
  const { products, fetchProductsByMaker, loading: productsLoading } = useProducts();
  
  // Removemos 'productsCount' do estado, pois ele será calculado na hora (derivado)
  const [stats] = useState<MakerStats>({
    totalSales: 0,     
    activeOrders: 0,   
    rating: 5.0        
  });
  
  const [recentOrders] = useState<Order[]>([]);

  // 1. Carrega o perfil do Maker
  useEffect(() => {
    if (user) {
      fetchMakerData();
    }
  }, [user, fetchMakerData]);

  // 2. Busca produtos
  useEffect(() => {
    if (makerProfile?.id) {
      fetchProductsByMaker(makerProfile.id);
    }
  }, [makerProfile, fetchProductsByMaker]);

  // CORREÇÃO: Calculamos a contagem diretamente aqui, sem useEffect
  const productsCount = products ? products.length : 0;

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Maker';
  
  // Verifica se está carregando algo
  const isLoading = makerLoading || productsLoading;

  return (
    <div className="min-h-screen bg-[#0B0C15] text-slate-200 p-6 md:p-8 pt-28">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Oficina de <span className="text-brand-orange">{firstName}</span>
            </h1>
            <p className="text-slate-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${makerProfile ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></span>
              {makerProfile ? "Operação Ativa" : "Configurando Perfil..."}
            </p>
          </div>
          <div className="flex gap-3">
             <Link href="/makers/settings">
                <BaseButton variant="secondary" leftIcon={<Settings size={18} />}>
                   Configurações
                </BaseButton>
             </Link>
             <Link href="/makers/products/new">
                <BaseButton leftIcon={<Plus size={18} />} className="shadow-neon shadow-brand-neon/20">
                   Novo Projeto
                </BaseButton>
             </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <StatCard 
              title="Faturamento Total" 
              value={`R$ ${stats.totalSales.toFixed(2)}`} 
              icon={<DollarSign size={24} className="text-brand-neon" />}
           />
           <StatCard 
              title="Pedidos Ativos" 
              value={stats.activeOrders.toString()} 
              icon={<Package size={24} className="text-brand-orange" />}
              subtext="Aguardando envio"
              active={stats.activeOrders > 0}
           />
           <StatCard 
              title="Produtos na Vitrine" 
              // Exibe "..." enquanto carrega, ou o número real
              value={isLoading ? "..." : productsCount.toString()} 
              icon={<Box size={24} className="text-blue-400" />}
              subtext="Itens publicados"
           />
           <StatCard 
              title="Sua Reputação" 
              value={stats.rating.toFixed(1)} 
              icon={<TrendingUp size={24} className="text-yellow-400" />}
              subtext="Novo Maker"
           />
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Link href="/makers/products/new?type=physical" className="group relative overflow-hidden bg-[#131B2E] border border-white/5 hover:border-brand-orange rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Package size={120} />
              </div>
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <Box size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Vender Peça Pronta</h3>
                 <p className="text-slate-400 text-sm max-w-sm">Cadastre action figures, peças de reposição ou produtos físicos para venda imediata.</p>
              </div>
           </Link>

           <Link href="/makers/products/new?type=service" className="group relative overflow-hidden bg-[#131B2E] border border-white/5 hover:border-brand-neon rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Printer size={120} />
              </div>
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-brand-neon/10 rounded-xl flex items-center justify-center text-brand-neon mb-4 group-hover:bg-brand-neon group-hover:text-black transition-colors">
                    <Printer size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Oferecer Serviços</h3>
                 <p className="text-slate-400 text-sm max-w-sm">Disponibilize suas impressoras ou CNC para receber arquivos de clientes e orçar serviços.</p>
              </div>
           </Link>
        </div>

        {/* ÚLTIMOS PEDIDOS */}
        <div className="bg-[#131B2E] border border-white/5 rounded-2xl overflow-hidden">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Pedidos Recentes</h3>
              {recentOrders.length > 0 && (
                <Link href="/makers/orders" className="text-xs text-brand-orange hover:text-white transition-colors font-bold uppercase tracking-wider">
                    Ver todos
                </Link>
              )}
           </div>
           
           <div className="p-0">
              {recentOrders.length > 0 ? (
                 <div className="w-full">
                    {/* Lista de pedidos futura */}
                 </div>
              ) : (
                 <div className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500">
                       <ShoppingBag size={32} />
                    </div>
                    <h3 className="text-white font-bold mb-2">Nenhum pedido ainda</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-md">
                        {productsCount === 0 
                            ? "Cadastre seus primeiros produtos para começar a aparecer no marketplace." 
                            : "Seus produtos estão ativos! Aguarde as primeiras encomendas."}
                    </p>
                    {productsCount === 0 && (
                        <Link href="/makers/products/new">
                            <BaseButton size="sm">Cadastrar Produto</BaseButton>
                        </Link>
                    )}
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}

// Componentes Auxiliares
interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: string;
    subtext?: string;
    active?: boolean;
}

const StatCard = ({ title, value, icon, trend, subtext, active }: StatCardProps) => (
   <div className={`p-6 rounded-2xl border transition-all ${active ? 'bg-brand-orange/10 border-brand-orange/50' : 'bg-[#131B2E] border-white/5'}`}>
      <div className="flex items-start justify-between mb-4">
         <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-black text-white">{value}</h3>
         </div>
         <div className={`p-2 rounded-lg ${active ? 'bg-brand-orange text-white' : 'bg-white/5 text-slate-400'}`}>
            {icon}
         </div>
      </div>
      {(trend || subtext) && (
         <div className="flex items-center gap-2 text-xs">
            {trend && <span className="text-green-400 font-bold bg-green-400/10 px-1.5 py-0.5 rounded">{trend}</span>}
            {subtext && <span className="text-slate-500">{subtext}</span>}
         </div>
      )}
   </div>
);