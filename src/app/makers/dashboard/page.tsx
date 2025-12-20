"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { BaseButton } from "@/presentation/design/components/buttons";
import { 
  Plus, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Printer, 
  Clock,
  Box
} from "lucide-react";

// Interfaces para tipagem
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
  productsCount: number;
  rating: number;
}

export default function MakerDashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<MakerStats>({
    totalSales: 0,
    activeOrders: 0,
    productsCount: 0,
    rating: 5.0
  });
  
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Definimos a função DENTRO do efeito. 
    // Isso evita problemas de "hoisting" (acessar antes de declarar) 
    // e problemas de dependência do React.
    const fetchDashboardData = async () => {
      try {
        // Simulando um pequeno delay para o React não achar que é uma atualização síncrona
        await new Promise(resolve => setTimeout(resolve, 100));

        // Aqui entraria a lógica real do Supabase
        
        // Dados Mockados
        setStats({
          totalSales: 1250.00,
          activeOrders: 3,
          productsCount: 12,
          rating: 4.8
        });
        
        setRecentOrders([
          { id: '#8821', product: 'Suporte Headset RGB', date: 'Hoje, 10:30', status: 'pending', value: 89.90 },
          { id: '#8820', product: 'Case Raspberry Pi 4', date: 'Ontem', status: 'completed', value: 45.00 },
        ]);

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]); // Depende apenas do usuário mudar

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Maker';

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
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Operação Ativa • Nível Maker Pro
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
              trend="+12% este mês"
           />
           <StatCard 
              title="Pedidos Ativos" 
              value={stats.activeOrders.toString()} 
              icon={<Package size={24} className="text-brand-orange" />}
              subtext="Aguardando envio"
              active
           />
           <StatCard 
              title="Produtos na Vitrine" 
              value={stats.productsCount.toString()} 
              icon={<Box size={24} className="text-blue-400" />}
              subtext="4 rascunhos"
           />
           <StatCard 
              title="Sua Reputação" 
              value={stats.rating.toString()} 
              icon={<TrendingUp size={24} className="text-yellow-400" />}
              subtext="Excelente"
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
                 <h3 className="text-xl font-bold text-white mb-2">Vender Peça Pronta ou Arquivo</h3>
                 <p className="text-slate-400 text-sm max-w-sm">Cadastre action figures, peças de reposição ou arquivos STL digitais para venda imediata.</p>
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
                 <h3 className="text-xl font-bold text-white mb-2">Orçamento Sob Demanda</h3>
                 <p className="text-slate-400 text-sm max-w-sm">Disponibilize suas impressoras para receber arquivos de clientes e orçar serviços personalizados.</p>
              </div>
           </Link>
        </div>

        {/* ÚLTIMOS PEDIDOS */}
        <div className="bg-[#131B2E] border border-white/5 rounded-2xl overflow-hidden">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Pedidos Recentes</h3>
              <Link href="/makers/orders" className="text-xs text-brand-orange hover:text-white transition-colors font-bold uppercase tracking-wider">
                 Ver todos
              </Link>
           </div>
           
           <div className="p-0">
              {recentOrders.length > 0 ? (
                 <div className="w-full">
                    <div className="hidden md:grid grid-cols-5 gap-4 p-4 text-xs font-bold text-slate-500 uppercase tracking-wider bg-black/20">
                       <div className="col-span-2">Produto / ID</div>
                       <div>Data</div>
                       <div>Status</div>
                       <div className="text-right">Valor</div>
                    </div>
                    <div className="divide-y divide-white/5">
                       {recentOrders.map((order) => (
                          <div key={order.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                             <div className="col-span-2 flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-slate-400">
                                   <Box size={20} />
                                </div>
                                <div>
                                   <div className="text-white font-bold">{order.product}</div>
                                   <div className="text-slate-500 text-xs">{order.id}</div>
                                </div>
                             </div>
                             <div className="text-sm text-slate-400 flex items-center gap-2 md:hidden">
                                <Clock size={14} /> {order.date}
                             </div>
                             <div className="hidden md:block text-sm text-slate-400">{order.date}</div>
                             <div>
                                <StatusBadge status={order.status} />
                             </div>
                             <div className="text-right font-bold text-white">
                                R$ {order.value.toFixed(2)}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              ) : (
                 <div className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500">
                       <Package size={32} />
                    </div>
                    <h3 className="text-white font-bold mb-2">Nenhum pedido ainda</h3>
                    <p className="text-slate-400 text-sm mb-6">Cadastre seus primeiros produtos para começar a vender.</p>
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

const StatusBadge = ({ status }: { status: string }) => {
   const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
   };
   
   const labels: Record<string, string> = {
      pending: "Pendente",
      completed: "Concluído",
      cancelled: "Cancelado"
   };

   return (
      <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[status] || styles.pending}`}>
         {labels[status] || status}
      </span>
   );
};