"use client";

import { useState, useCallback } from "react";
import { SupabaseProductRepository } from "@/infrastructure/repositories/SupabaseProductRepository";
import { Product } from "@/core/entities/Product";

const repo = new SupabaseProductRepository();

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsByMaker = useCallback(async (makerId: string) => {
    setLoading(true);
    try {
      const data = await repo.getByMakerId(makerId);
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true);
    try {
      await repo.create(productData);
      // Se tiver makerId, atualiza a lista local
      if (productData.makerId) {
        await fetchProductsByMaker(productData.makerId);
      }
    } catch (err: any) {
      setError(err.message);
      throw err; // Relança o erro para a página tratar
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProductsByMaker,
    createProduct
  };
};