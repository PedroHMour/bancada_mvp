import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + Slogan */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo-white.png"
                width={40}
                height={40}
                alt="Bancada"
                className="object-contain"
              />
              <span className="font-bold text-xl">Bancada</span>
            </div>
            <p className="text-gray-400 text-sm">
              Onde ideias ganham forma.
              <br />O ecossistema completo de impressão 3D.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/makers" className="hover:text-white transition-colors">
                  Makers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Bancada. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
