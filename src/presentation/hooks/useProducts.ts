"use client";

import { useState, useCallback } from "react";
import { SupabaseProductRepository } from "@/infrastructure/repositories/SupabaseProductRepository";
import { Product } from "@/core/entities/Product";

const repo = new SupabaseProductRepository();

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // BUSCAR TUDO (Para o Marketplace)
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repo.getAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar produtos de um Maker específico
  const fetchProductsByMaker = useCallback(async (makerId: string) => {
    setLoading(true);
    try {
      const data = await repo.getByMakerId(makerId);
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await repo.getById(id);
      setProduct(data);
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
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setLoading(true);
    try {
      await repo.update({ ...productData, id } as Product);
    } catch (err: any) {
       console.error("Erro update:", err);
       throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
        await repo.delete(id);
        setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
        console.error("Erro delete:", err);
        throw err;
    } finally {
        setLoading(false);
    }
  }

  return {
    products,
    product,
    loading,
    error,
    fetchAllProducts, // Nova função exportada
    fetchProductsByMaker,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };
};