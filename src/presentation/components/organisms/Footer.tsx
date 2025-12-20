import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#08090F] border-t border-white/5 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Bancada</h2>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              O ecossistema definitivo para manufatura distribuída. Conectando quem precisa criar com quem sabe fazer.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/marketplace" className="hover:text-brand-primary">Catálogo</Link></li>
              <li><Link href="/makers" className="hover:text-brand-primary">Makers</Link></li>
              <li><Link href="/auth/signup" className="hover:text-brand-primary">Vender</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-brand-primary">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-brand-primary">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-brand-primary">Privacidade</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Bancada MVP. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}