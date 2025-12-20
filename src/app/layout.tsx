import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../presentation/contexts/AuthContext";
import { Navbar } from "@/presentation/components/organisms/Navbar";
import { Footer } from "@/presentation/components/organisms/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bancada | Manufatura Distribuída",
  description: "O marketplace de impressão 3D e serviços maker.",
  icons: {
    icon: [
      // Se o navegador estiver no modo CLARO (Light), usa a logo preta
      { url: '/logo.png', media: '(prefers-color-scheme: light)' },
      
      // Se o navegador estiver no modo ESCURO (Dark), usa a logo branca
      { url: '/logo-white.png', media: '(prefers-color-scheme: dark)' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#0B0C15] text-slate-200 min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}