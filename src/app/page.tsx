"use client";

import Link from "next/link";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ArrowRight, Box, Printer, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    // Removi 'min-h-screen' daqui porque o layout.tsx já trata da altura da página
    <div className="flex flex-col w-full">
      
      {/* A NAVBAR FOI REMOVIDA DAQUI. 
          Ela agora virá automaticamente do src/app/layout.tsx 
      */}

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden min-h-[calc(100vh-80px)]">
        
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-brand-neon/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Badge "Em Breve" */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-neon/10 border border-brand-neon/20 text-brand-neon text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles size={14} /> Em breve novidades
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 max-w-3xl leading-tight">
          O Marketplace Oficial dos <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Makers & Impressores 3D</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Conecte-se com quem cria. Venda seus projetos, ofereça serviços de impressão ou encontre a peça exclusiva que você procura.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none justify-center">
          <Link href="/makers/dashboard">
            <BaseButton size="lg" className="w-full sm:w-auto h-14 px-8 text-lg" leftIcon={<Printer size={20}/>}>
              Sou Maker / Vendedor
            </BaseButton>
          </Link>
          <Link href="/marketplace">
            <BaseButton size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg" rightIcon={<ArrowRight size={20}/>}>
              Explorar Marketplace
            </BaseButton>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full text-left">
          <FeatureCard 
            icon={<Box className="text-brand-orange" />}
            title="Produtos Físicos"
            desc="Venda peças prontas, action figures e gadgets impressos."
          />
          <FeatureCard 
            icon={<Zap className="text-brand-neon" />}
            title="Arquivos Digitais"
            desc="Comercialize seus STLs e modelos 3D com segurança."
          />
          <FeatureCard 
            icon={<Printer className="text-blue-400" />}
            title="Serviços Sob Demanda"
            desc="Receba pedidos de impressão personalizados de clientes."
          />
        </div>

      </main>

      <footer className="p-6 text-center text-slate-600 text-sm border-t border-white/5">
        &copy; 2025 Bancada MVP. Feito por Makers para Makers.
      </footer>
    </div>
  );
}

// Pequeno componente auxiliar local
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[#131525] border border-white/5 hover:border-white/10 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );
}