// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/presentation/contexts/AuthContext";
import { Navbar } from "@/presentation/components/organisms/Navbar"; // Importar Navbar
import { Footer } from "@/presentation/components/organisms/Footer"; // Importar Footer (se você tiver um)

export const metadata: Metadata = {
  title: "Bancada - Onde ideias ganham forma",
  description: "O ecossistema completo de impressão 3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>
          <Navbar /> {/* Renderizar Navbar */}
          <main className="pt-20 min-h-[calc(100vh-80px)]"> {/* Ajustar padding-top para a altura da navbar */}
            {children}
          </main>
          <Footer /> {/* Renderizar Footer (se você tiver um) */}
        </AuthProvider>
      </body>
    </html>
  );
}
