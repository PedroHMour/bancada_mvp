import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/presentation/contexts/AuthContext";
import { Navbar } from "@/presentation/components/organisms/Navbar";
import { Footer } from "@/presentation/components/organisms/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bancada | Manufatura Distribuída",
  description: "O marketplace de impressão 3D e serviços maker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* bg-[#0B0C15]: Garante fundo preto globalmente
         text-slate-200: Cor de texto padrão clara
         min-h-screen flex flex-col: Garante que o footer vá para o final
      */}
      <body className={`${inter.className} bg-[#0B0C15] text-slate-200 min-h-screen flex flex-col`}>
        <AuthProvider>
          {/* Navbar fixa no topo */}
          <Navbar />
          
          {/* Main expande para ocupar espaço vazio, empurrando o footer para baixo */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer no final */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}