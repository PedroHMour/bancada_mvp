"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useMakers } from "@/presentation/hooks/useMakers"; 
import { BaseButton } from "@/presentation/design/components/buttons";
import { Plus, Package, TrendingUp, Settings, AlertCircle, ArrowRight, Loader2, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { makerProfile, fetchMakerData } = useMakers();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    if (user && !makerProfile) {
      fetchMakerData();
    }
  }, [user, makerProfile, fetchMakerData]);

  if (authLoading) {
    return <div className="flex justify-center pt-32"><Loader2 className="animate-spin text-brand-primary"/></div>;
  }

  return (
    <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Painel de Controle
            </h1>
            <p className="text-slate-400">
              Bem-vindo, <span className="font-semibold text-brand-primary">{makerProfile?.businessName || user?.user_metadata?.full_name}</span>. Aqui está o resumo da sua bancada.
            </p>
          </div>
          
          <div className="flex gap-3">
             <Link href="/makers/settings">
              <BaseButton variant="outline" className="border-white/10 bg-[#131525] hover:bg-white/5 text-slate-300">
                <Settings className="w-4 h-4 mr-2" /> Configurações
              </BaseButton>
            </Link>
            <Link href="/makers/products/new">
              <BaseButton className="bg-brand-primary hover:bg-brand-hover text-white border-0 shadow-lg shadow-brand-primary/20">
                <Plus className="w-4 h-4 mr-2" /> Novo Produto
              </BaseButton>
            </Link>
          </div>
        </div>

        {/* ALERTA DE PERFIL INICIAL */}
        {makerProfile?.bio === "Bancada criada recentemente." && (
          <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                 <Settings size={24} />
               </div>
               <div>
                 <p className="font-bold text-white text-lg">Configure sua Bancada</p>
                 <p className="text-sm text-blue-200/70">Seu perfil está com dados padrão. Complete para atrair mais clientes.</p>
               </div>
            </div>
            <Link href="/makers/settings">
              <BaseButton size="sm" className="bg-blue-600 hover:bg-blue-500 border-0 text-white whitespace-nowrap">
                Editar Perfil
              </BaseButton>
            </Link>
          </div>
        )}

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Receita Total" 
            value="R$ 0,00" 
            icon={<DollarSign size={24} className="text-green-400" />} 
            trend="+0% este mês"
            color="green"
          />
          <StatCard 
            title="Pedidos Ativos" 
            value="0" 
            icon={<AlertCircle size={24} className="text-brand-primary" />} 
            trend="Aguardando clientes"
            color="blue"
          />
          <StatCard 
            title="Produtos no Catálogo" 
            value="0" 
            icon={<Package size={24} className="text-purple-400" />} 
            trend="Ver todos"
            color="purple"
          />
        </div>

        {/* Área de Pedidos Vazia */}
        <div className="bg-[#131525] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white">Pedidos Recentes</h3>
            <Link href="/makers/orders" className="text-sm text-brand-primary hover:text-brand-hover font-medium transition-colors">
              Ver histórico
            </Link>
          </div>
          <div className="p-16 text-center flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-500 border border-white/5">
               <Package size={32} className="opacity-50" />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Tudo calmo por aqui</h3>
             <p className="text-slate-400 max-w-sm mx-auto mb-8">
               Seus pedidos aparecerão aqui assim que os clientes começarem a comprar.
             </p>
             {makerProfile?.bio === "Bancada criada recentemente." && (
                 <Link href="/makers/products/new">
                    <BaseButton variant="outline" className="border-white/10 text-white hover:bg-white/5">
                        Cadastrar Primeiro Produto
                    </BaseButton>
                 </Link>
             )}
          </div>
        </div>

    </div>
  );
}

// Subcomponente de Card (Dark Theme)
function StatCard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    green: "bg-green-500/10 border-green-500/20",
    blue: "bg-blue-500/10 border-blue-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="bg-[#131525] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h4 className="text-3xl font-bold text-white">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl border ${colors[color] || "bg-slate-800"}`}>
          {icon}
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
        <TrendingUp size={14} className="text-slate-600"/> {trend}
      </p>
    </div>
  );
}