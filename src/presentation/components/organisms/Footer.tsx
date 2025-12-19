import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    // CONTRASTE: bg-[#0B0C15] mantido, mas borda clareada para white/10 para separar melhor
    <footer className="w-full bg-[#0B0C15] border-t border-white/10 pt-20 pb-10 mt-auto z-10 relative">
      <div className="container-custom mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Coluna 1: Logo e Sobre */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-opacity">
               <Image 
                 src="/logo-white.png" 
                 alt="Bancada" 
                 width={120} 
                 height={32} 
                 className="h-8 w-auto object-contain"
               />
            </Link>
            {/* Texto clareado para slate-400 para leitura fácil no fundo preto */}
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              A infraestrutura para a nova geração de manufatura distribuída. Conectamos ideias a máquinas.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* Coluna 2: Plataforma */}
          <div>
            <h4 className="font-bold text-slate-100 mb-6 text-base">Plataforma</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/marketplace" className="hover:text-brand-primary hover:pl-1 transition-all">Marketplace</Link></li>
              <li><Link href="/auth/signup" className="hover:text-brand-primary hover:pl-1 transition-all">Seja um Maker</Link></li>
              <li><Link href="#" className="hover:text-brand-primary hover:pl-1 transition-all">Como Funciona</Link></li>
              <li><Link href="#" className="hover:text-brand-primary hover:pl-1 transition-all">Preços</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Suporte */}
          <div>
            <h4 className="font-bold text-slate-100 mb-6 text-base">Suporte</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-brand-primary hover:pl-1 transition-all">Central de Ajuda</Link></li>
              <li><Link href="#" className="hover:text-brand-primary hover:pl-1 transition-all">Termos de Uso</Link></li>
              <li><Link href="#" className="hover:text-brand-primary hover:pl-1 transition-all">Privacidade</Link></li>
              <li><Link href="#" className="hover:text-brand-primary hover:pl-1 transition-all">Contato</Link></li>
            </ul>
          </div>

           {/* Coluna 4: Newsletter */}
           <div>
            <h4 className="font-bold text-slate-100 mb-6 text-base">Fique por dentro</h4>
            <p className="text-xs text-slate-400 mb-4">Receba novidades sobre impressão 3D e tecnologia.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="seu@email.com" 
                className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Rodapé do Rodapé */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Bancada Inc. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-slate-500 font-medium">
            <span>Feito com ❤️ no Brasil</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }: { icon: any }) => (
  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
    {icon}
  </a>
);