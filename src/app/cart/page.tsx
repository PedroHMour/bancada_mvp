// src/app/cart/page.tsx
"use client";

import { useCart } from "@/presentation/hooks/useCart";
import { BaseCard } from "@/presentation/design/components/cards";
import { BaseButton } from "@/presentation/design/components/buttons";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link"; // Importar Link para o botão "Voltar ao Marketplace"

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeFromCart, clearCart } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  const hasItems = cart.items.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-text-primary text-center">
        Seu Carrinho
      </h1>

      {!hasItems ? (
        <BaseCard className="p-8 text-center">
          <p className="text-gray-600 text-lg mb-6">
            Seu carrinho está vazio. Adicione serviços dos seus makers favoritos!
          </p>
          <Link href="/marketplace">
            <BaseButton>
              Voltar ao Marketplace
            </BaseButton>
          </Link>
        </BaseCard>
      ) : (
        <>
          <BaseCard className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={`${item.makerId}-${item.serviceId}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div>
                  <p className="text-sm text-text-secondary">
                    De: <Link href={`/makers/${item.makerId}`} className="text-brand-primary hover:underline">{item.makerName}</Link>
                  </p>
                  <h2 className="text-lg font-semibold text-text-primary">
                    {item.serviceName}
                  </h2>
                  <p className="text-brand-primary font-bold mt-1">
                    R$ {item.price.toFixed(2)} x {item.quantity} ={" "}
                    <span className="underline">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      className="px-3 py-1 hover:bg-gray-100"
                      onClick={() =>
                        updateQuantity(
                          item.serviceId,
                          item.makerId,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-semibold min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="px-3 py-1 hover:bg-gray-100"
                      onClick={() =>
                        updateQuantity(
                          item.serviceId,
                          item.makerId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    onClick={() =>
                      removeFromCart(item.serviceId, item.makerId)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </BaseCard>

          <BaseCard className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-secondary">Total do Carrinho</p>
              <p className="text-2xl font-bold text-brand-primary">
                R$ {cart.total.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <BaseButton variant="outline" onClick={clearCart}>
                Esvaziar carrinho
              </BaseButton>
              <BaseButton>
                Finalizar pedido (em breve)
              </BaseButton>
            </div>
          </BaseCard>
        </>
      )}
    </div>
  );
}
