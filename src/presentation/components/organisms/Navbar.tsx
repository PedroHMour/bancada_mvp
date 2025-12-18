// src/presentation/components/organisms/Navbar.tsx
"use client";

import Link from "next/link";
import { ShoppingCart, User, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useCart } from "@/presentation/hooks/useCart";
import { useRouter } from "next/navigation";
import { BaseButton } from "@/presentation/design/components/buttons";
import Image from "next/image";

export function Navbar() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login"); // Redireciona para login após logout
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-background-card shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png" // Certifique-se de ter um logo.png na pasta public
            alt="Bancada Logo"
            width={32}
            height={32}
            unoptimized={true} // Para evitar erros de SVG se o logo for um placeholder
          />
          <span className="text-xl font-bold text-text-primary">Bancada</span>
        </Link>

        {/* Navegação Principal */}
        <div className="flex items-center gap-6">
          <Link href="/marketplace" className="text-text-secondary hover:text-brand-primary transition-colors">
            Marketplace
          </Link>
          {/* A opção "Maker" foi removida conforme solicitado */}
        </div>

        {/* Ícones de Ação */}
        <div className="flex items-center gap-4">
          {/* Carrinho */}
          <Link href="/cart" className="relative text-text-secondary hover:text-brand-primary transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </Link>

          {/* Autenticação */}
          {!authLoading && (
            <>
              {user ? (
                <>
                  {/* Link para o Dashboard do Maker */}
                  <Link href="/makers/dashboard" className="text-text-secondary hover:text-brand-primary transition-colors">
                    <LayoutDashboard className="w-6 h-6" />
                  </Link>
                  {/* Botão de Logout */}
                  <BaseButton variant="ghost" size="icon" onClick={handleLogout} className="text-text-secondary hover:text-brand-primary">
                    <LogOut className="w-6 h-6" />
                  </BaseButton>
                </>
              ) : (
                // Botão de Login
                <Link href="/auth/login">
                  <BaseButton variant="ghost" size="icon" className="text-text-secondary hover:text-brand-primary">
                    <LogIn className="w-6 h-6" />
                  </BaseButton>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
