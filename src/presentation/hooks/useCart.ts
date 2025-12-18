// src/presentation/hooks/useCart.ts
"use client";

import { useState, useEffect } from "react";
import { Cart, CartItem } from "@/core/entities/Cart";

const CART_STORAGE_KEY = "bancada-mvp-cart";

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erro ao carregar carrinho:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLoading) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Erro ao salvar carrinho:", e);
    }
  }, [cart, isLoading]);

  const recalcTotal = (items: CartItem[]) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.items.find(
        i => i.serviceId === item.serviceId && i.makerId === item.makerId
      );
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.items.map(i =>
          i.serviceId === item.serviceId && i.makerId === item.makerId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...prev.items, item];
      }
      return { items: newItems, total: recalcTotal(newItems) };
    });
  };

  const removeFromCart = (serviceId: string, makerId: string) => {
    setCart(prev => {
      const newItems = prev.items.filter(
        i => !(i.serviceId === serviceId && i.makerId === makerId)
      );
      return { items: newItems, total: recalcTotal(newItems) };
    });
  };

  const updateQuantity = (serviceId: string, makerId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId, makerId);
      return;
    }
    setCart(prev => {
      const newItems = prev.items.map(i =>
        i.serviceId === serviceId && i.makerId === makerId
          ? { ...i, quantity }
          : i
      );
      return { items: newItems, total: recalcTotal(newItems) };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
