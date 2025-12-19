import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/presentation/contexts/AuthContext";
import { Navbar } from "@/presentation/components/organisms/Navbar";
import { Footer } from "@/presentation/components/organisms/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bancada | Ecossistema Maker",
  description: "Marketplace profissional de impressão 3D e manufatura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        <AuthProvider>
          {/* A Navbar é global e fixa (z-index alto) */}
          <Navbar />
          
          {/* O Main não tem padding forçado. Cada página/layout gerencia seu espaço. */}
          <main className="flex-grow w-full flex flex-col relative z-0">
            {children}
          </main>
          
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}