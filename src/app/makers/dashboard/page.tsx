"use client";

import { useEffect, useState } from "react";
import { Plus, Package, DollarSign, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";

export default function MakerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats] = useState({ products: 0, sales: 0, revenue: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0C15]">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C15] text-white pt-24 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Fábrica<span className="text-brand-primary">_Dashboard</span></h1>
            <p className="text-slate-500 text-sm font-medium">Gerencie suas criações.</p>
          </div>
          <Link href="/makers/dashboard/products/new">
            <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all">
              <Plus size={20} /> Novo Produto
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#131525] p-8 rounded-3xl border border-white/5 space-y-2 hover:border-brand-primary/30 transition-colors">
            <Package size={20} className="text-brand-primary"/>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Produtos Ativos</p>
            <p className="text-3xl font-black">{stats.products}</p>
          </div>
          <div className="bg-[#131525] p-8 rounded-3xl border border-white/5 space-y-2 hover:border-brand-primary/30 transition-colors">
            <ShoppingCart size={20} className="text-green-500"/>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Vendas Totais</p>
            <p className="text-3xl font-black">{stats.sales}</p>
          </div>
          <div className="bg-[#131525] p-8 rounded-3xl border border-white/5 space-y-2 hover:border-brand-primary/30 transition-colors">
            <DollarSign size={20} className="text-purple-500"/>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Receita</p>
            <p className="text-3xl font-black">R$ {stats.revenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-[#131525] border border-dashed border-white/10 rounded-[2rem] p-20 text-center">
            <Package size={48} className="mx-auto mb-4 text-slate-800" />
            <h3 className="text-xl font-bold text-white mb-2">Sua bancada está vazia</h3>
            <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">Comece agora cadastrando sua primeira peça exclusiva na Bancada.</p>
            <Link href="/makers/dashboard/products/new">
                <button className="text-brand-primary text-sm font-black uppercase tracking-widest hover:underline italic">Cadastrar Primeira Peça →</button>
            </Link>
        </div>
      </div>
    </div>
  );
}