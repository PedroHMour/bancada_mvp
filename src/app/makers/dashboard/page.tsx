"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useMakers } from "@/presentation/hooks/useMakers"; // O hook essencial
import { BaseButton } from "@/presentation/design/components/buttons";
import { Plus, Package, TrendingUp, Settings, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  
  // AQUI: Buscamos o perfil e os estados de carregamento
  const { makerProfile, fetchMakerData, loading: makerLoading } = useMakers();

  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  // Buscar dados assim que o usuário logado for detectado
  useEffect(() => {
    if (user && !makerProfile) {
      fetchMakerData();
    }
  }, [user, makerProfile, fetchMakerData]);

  if (authLoading) {
    return <div className="flex justify-center pt-32"><Loader2 className="animate-spin text-brand-primary"/></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6">
      <div className="container-custom max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Painel de Controle
            </h1>
            <p className="text-slate-500">
              Bem-vindo de volta, <span className="font-semibold text-brand-primary">{user?.user_metadata?.full_name || makerProfile?.businessName}</span>.
            </p>
          </div>
          
          <div className="flex gap-3">
             <Link href="/makers/settings">
              <BaseButton variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700">
                <Settings className="w-4 h-4 mr-2" /> Configurações
              </BaseButton>
            </Link>
            <Link href="/makers/products/new">
              <BaseButton className="bg-brand-primary hover:bg-brand-hover text-white shadow-lg shadow-brand-primary/20">
                <Plus className="w-4 h-4 mr-2" /> Novo Produto
              </BaseButton>
            </Link>
          </div>
        </div>

        {/* ALERTA DE PERFIL INICIAL (Agora seguro porque makerProfile existe) */}
        {makerProfile?.bio === "Bancada criada recentemente." && (
          <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                 <Settings size={20} />
               </div>
               <div>
                 <p className="font-bold text-blue-900">Configure sua Bancada</p>
                 <p className="text-sm text-blue-700">Seu perfil está com dados padrão. Edite para atrair mais clientes.</p>
               </div>
            </div>
            <Link href="/makers/settings">
              <BaseButton size="sm" className="bg-blue-600 hover:bg-blue-700 border-0 text-white">
                Editar Perfil
              </BaseButton>
            </Link>
          </div>
        )}

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Receita Total" 
            value="R$ 0,00" 
            icon={<TrendingUp className="text-green-600" />} 
            trend="+0% este mês"
          />
          <StatCard 
            title="Pedidos Ativos" 
            value="0" 
            icon={<AlertCircle className="text-blue-600" />} 
            trend="Aguardando clientes"
          />
          <StatCard 
            title="Produtos Ativos" 
            value="0" 
            icon={<Package className="text-purple-600" />} 
            trend="Ver catálogo"
          />
        </div>

        {/* Área de Pedidos */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Pedidos Recentes</h3>
            <Link href="/makers/orders" className="text-sm text-brand-primary hover:underline font-medium">
              Ver todos
            </Link>
          </div>
          <div className="p-12 text-center text-slate-400">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Package size={24} className="opacity-50" />
             </div>
             <p>Nenhum pedido recebido ainda.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          {icon}
        </div>
      </div>
      <p className="text-xs font-medium text-slate-400">{trend}</p>
    </div>
  );
}