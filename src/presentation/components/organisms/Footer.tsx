import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";
import { BaseButton } from "@/presentation/design/components/buttons";
import { ReactNode } from "react";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#050810] border-t border-white/10 pt-20 pb-10 mt-auto relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="container-custom mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 border-b border-white/5 pb-12">
          
          <div className="md:col-span-4 flex flex-col items-start">
            <Link href="/" className="mb-6 block">
               <Image 
                 src="/logo-white.png" 
                 alt="Bancada" 
                 width={120} 
                 height={32} 
                 className="h-8 w-auto object-contain opacity-90"
               />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              A infraestrutura para a nova geração de manufatura distribuída. <br/>
              <span className="text-slate-500">Conectamos ideias a máquinas em todo o Brasil.</span>
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Explorar</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><FooterLink href="/marketplace">Marketplace</FooterLink></li>
              <li><FooterLink href="/makers">Makers Locais</FooterLink></li>
              <li><FooterLink href="/materials">Materiais</FooterLink></li>
              <li><FooterLink href="/blog">Blog da Bancada</FooterLink></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><FooterLink href="/about">Sobre Nós</FooterLink></li>
              <li><FooterLink href="/makers/new">Seja um Parceiro</FooterLink></li>
              <li><FooterLink href="/terms">Termos de Uso</FooterLink></li>
              <li><FooterLink href="/privacy">Privacidade</FooterLink></li>
            </ul>
          </div>

           <div className="md:col-span-4 bg-white/5 rounded-2xl p-6 border border-white/5">
            <h4 className="font-bold text-white mb-2 text-base">Bancada Weekly</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Dicas de impressão, novos materiais e tendências maker direto na sua inbox.
            </p>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="w-full bg-[#0B0C15] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all"
                />
              </div>
              <BaseButton size="sm" className="w-full justify-center">
                Inscrever-se <ArrowRight size={16} className="ml-2"/>
              </BaseButton>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Bancada Inc. CNPJ 00.000.000/0001-00
          </p>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Todos os sistemas operacionais</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }: { icon: ReactNode }) => (
  <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:-translate-y-1 transition-all">
    {icon}
  </a>
);

const FooterLink = ({ href, children }: { href: string, children: ReactNode }) => (
  <Link href={href} className="hover:text-brand-orange transition-colors flex items-center group">
    <span className="w-0 group-hover:w-2 transition-all h-px bg-brand-orange mr-0 group-hover:mr-2"></span>
    {children}
  </Link>
);