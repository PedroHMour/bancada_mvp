"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Printer, Search, Upload, Truck, ShieldCheck, Zap, Users, CheckCircle2 } from "lucide-react";
import { BaseButton } from "@/presentation/design/components/buttons";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0B0C15] text-slate-200">
      
      {/* HERO SECTION 
        - pt-32 mobile / pt-40 desktop: Espaço seguro para navbar fixa.
        - pb-16: Espaço inferior antes dos cards.
      */}
      <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-12 md:pt-40 md:pb-20 px-4 md:px-6 overflow-hidden">
        
        {/* Background Effects (Sutis e posicionados para não atrapalhar leitura) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
           <div className="absolute top-[-100px] left-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-primary/30 rounded-full blur-[100px]"></div>
           <div className="absolute top-[20%] right-[10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-purple-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="container-custom relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto animate-enter">
          
          
          {/* Título Responsivo */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.15]">
            A Indústria Digital <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary text-white mb-6 leading-[1.15]">
              Na sua Bancada.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Conectamos quem precisa de peças personalizadas a Makers com impressoras 3D e CNC prontas para produzir.
          </p>

          {/* CARDS DE DECISÃO (Mobile: Empilhado / Desktop: Lado a Lado) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
            
            {/* Opção CLIENTE */}
            <Link href="/marketplace" className="group relative w-full">
              <div className="h-full bg-[#131525] hover:bg-[#1A1D33] border border-white/5 hover:border-blue-500/40 rounded-2xl p-6 sm:p-8 flex flex-col items-start text-left transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                     <ShoppingBag size={24} />
                   </div>
                   <h2 className="text-xl font-bold text-white">Quero Comprar</h2>
                 </div>
                 <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                   Encontre action figures, peças de reposição e protótipos, ou solicite um orçamento.
                 </p>
                 <div className="mt-auto flex items-center text-blue-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                   Explorar Catálogo <ArrowRight size={16} className="ml-2"/>
                 </div>
              </div>
            </Link>

            {/* Opção MAKER */}
            <Link href="/auth/signup" className="group relative w-full">
              <div className="h-full bg-[#131525] hover:bg-[#1A1D33] border border-white/5 hover:border-brand-primary/40 rounded-2xl p-6 sm:p-8 flex flex-col items-start text-left transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/10">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20">
                     <Printer size={24} />
                   </div>
                   <h2 className="text-xl font-bold text-white">Sou Maker</h2>
                 </div>
                 <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                   Transforme tempo ocioso das suas máquinas em lucro. Receba pedidos verificados.
                 </p>
                 <div className="mt-auto flex items-center text-brand-primary text-sm font-bold group-hover:translate-x-1 transition-transform">
                   Criar Minha Bancada <ArrowRight size={16} className="ml-2"/>
                 </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA 
        - Fundo ligeiramente diferente para contraste visual.
        - Padding responsivo: py-16 (mobile) a py-24 (desktop).
      */}
      <section className="w-full py-16 md:py-24 bg-[#0F101B] border-y border-white/5">
        <div className="container-custom max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Simples e Transparente</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Sem orçamentos escondidos. O processo é direto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Linha conectora apenas desktop */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent -z-10"></div>

            {/* Passo 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#131525] rounded-full flex items-center justify-center text-slate-300 mb-6 border border-white/10 shadow-lg z-10">
                <Search size={32}/>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Escolha</h3>
              <p className="text-slate-400 text-sm leading-relaxed px-4">
                Navegue pelo marketplace ou faça upload do seu arquivo STL.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#131525] rounded-full flex items-center justify-center text-slate-300 mb-6 border border-white/10 shadow-lg z-10">
                <Upload size={32}/>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Produção</h3>
              <p className="text-slate-400 text-sm leading-relaxed px-4">
                Um Maker qualificado aceita o pedido e inicia a fabricação.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#131525] rounded-full flex items-center justify-center text-slate-300 mb-6 border border-white/10 shadow-lg z-10">
                <Truck size={32}/>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Entrega</h3>
              <p className="text-slate-400 text-sm leading-relaxed px-4">
                Receba em casa com segurança e libere o pagamento ao Maker.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SEÇÃO: DIFERENCIAIS (Bento Grid)
        - Layout moderno em grid
      */}
      <section className="w-full py-16 md:py-24 bg-[#0B0C15]">
        <div className="container-custom max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-12 text-center">Por que a Bancada?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#131525] p-8 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-colors">
              <ShieldCheck className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Pagamento Seguro</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Seu dinheiro fica retido na plataforma até que você receba o produto em perfeito estado.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#131525] p-8 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-colors">
              <Users className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Makers Verificados</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Avaliamos portfólios e qualidade de entrega para garantir o melhor resultado.</p>
            </div>

            {/* Card 3 (Ocupa 2 colunas no tablet, 1 no desktop) */}
            <div className="bg-[#131525] p-8 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-colors md:col-span-2 lg:col-span-1">
              <Zap className="w-10 h-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Produção Local</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Menor custo de frete e tempo de entrega ao conectar você a makers próximos.</p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA FINAL
        - Espaçamento generoso para finalizar a página
      */}
      <section className="w-full py-24 relative overflow-hidden bg-gradient-to-b from-[#0B0C15] to-[#131525]">
        <div className="container-custom relative z-10 text-center px-6">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Vamos construir algo?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Junte-se ao ecossistema de manufatura distribuída.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <BaseButton size="lg" className="w-full px-10 py-6 text-lg bg-white text-black hover:bg-slate-200 border-0 shadow-lg shadow-white/10">
                Criar Conta Grátis
              </BaseButton>
            </Link>
            <Link href="/marketplace" className="w-full sm:w-auto">
               <BaseButton size="lg" variant="outline" className="w-full px-10 py-6 text-lg border-white/20 text-white hover:bg-white/10">
                  Explorar Marketplace
               </BaseButton>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500 font-medium">
             <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-primary"/> Sem mensalidade</span>
             <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-primary"/> Setup instantâneo</span>
          </div>
        </div>
      </section>

    </div>
  );
}