// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ArrowRight, ShoppingBag, Printer } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#0B0C15] overflow-x-hidden">
      
      {/* HERO SECTION: A ESCOLHA */}
      <section className="relative w-full min-h-screen flex items-center justify-center py-20">
        
        {/* Fundo Decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/30 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="container-custom relative z-10 flex flex-col items-center text-center">
          
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Ecossistema v1.0</span>
          </div>

          <h1 className="text-5xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-none">
            BANCADA<span className="text-brand-primary">.</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            O ponto de encontro entre quem precisa materializar ideias e quem tem as máquinas para fazer acontecer.
          </p>

          {/* A GRANDE ESCOLHA (SPLIT ACTIONS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            
            {/* CARD CLIENTE */}
            <Link href="/marketplace" className="group relative overflow-hidden rounded-3xl bg-white p-1 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              <div className="h-full bg-slate-50 rounded-[20px] p-8 flex flex-col items-center justify-center text-center border border-slate-100 group-hover:bg-white transition-colors">
                 <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <ShoppingBag size={32} />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Para Clientes</h2>
                 <p className="text-slate-500 mb-6">Busco peças prontas ou quero contratar um serviço de impressão.</p>
                 <span className="inline-flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                   Acessar Marketplace <ArrowRight size={18} className="ml-1"/>
                 </span>
              </div>
            </Link>

            {/* CARD MAKER */}
            <Link href="/auth/signup" className="group relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-brand-primary to-purple-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_#6C6CF2]">
              <div className="h-full bg-[#131525] rounded-[20px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="relative z-10 w-16 h-16 bg-brand-primary/20 text-brand-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-brand-primary/20">
                   <Printer size={32} />
                 </div>
                 <h2 className="relative z-10 text-2xl font-bold text-white mb-2">Para Makers</h2>
                 <p className="relative z-10 text-slate-400 mb-6">Tenho impressoras e quero vender meus produtos e serviços.</p>
                 <span className="relative z-10 inline-flex items-center text-brand-primary font-bold group-hover:gap-2 transition-all">
                   Criar Minha Bancada <ArrowRight size={18} className="ml-1"/>
                 </span>
              </div>
            </Link>

          </div>

        </div>
      </section>
    </div>
  );
}