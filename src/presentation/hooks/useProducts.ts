"use client";

import { useState, useCallback } from "react";
import { SupabaseProductRepository } from "@/infrastructure/repositories/SupabaseProductRepository";
import { Product } from "@/core/entities/Product";

const repo = new SupabaseProductRepository();

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  // Estado para um produto único (usado na edição)
  const [product, setProduct] = useState<Product | null>(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os produtos de um maker
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

  // NOVO: Buscar um único produto pelo ID (para edição)
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

  // Criar Produto
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

  // NOVO: Atualizar Produto
  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setLoading(true);
    try {
      // Assumindo que seu repositório tenha um método 'update'. 
      // Se não tiver, precisaremos criar no SupabaseProductRepository.ts.
      // O objeto passado deve conter o ID e os dados mudados.
      await repo.update({ ...productData, id } as Product);
    } catch (err: any) {
       console.error("Erro no hook update:", err);
       throw err;
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Deletar Produto
  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
        // Assumindo que seu repositório tenha um método 'delete'.
        await repo.delete(id);
        // Atualiza a lista local removendo o item deletado
        setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
        console.error("Erro ao deletar:", err);
        throw err;
    } finally {
        setLoading(false);
    }
  }

  return {
    products,
    product, // Exportando o produto único
    loading,
    error,
    fetchProductsByMaker,
    fetchProductById, // Exportando a nova função
    createProduct,
    updateProduct, // Exportando update
    deleteProduct // Exportando delete
  };
};