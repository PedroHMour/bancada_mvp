"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types"; // Importando do novo local

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Listar todos (Marketplace)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setProducts(data as Product[]);
    setLoading(false);
  }, []);

  // 2. Listar por Maker (Dashboard) - Renomeado para bater com seu uso
  const fetchProductsByMaker = useCallback(async (makerId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("maker_id", makerId)
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setProducts(data as Product[]);
    setLoading(false);
  }, []);

  // 3. Pegar um produto
  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) setError(error.message);
    else setProduct(data as Product);
    setLoading(false);
  }, []);

  // 4. Atualizar produto
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setLoading(true);
    const { error } = await supabase.from("products").update(updates).eq("id", id);
    if (error) throw error;
    if (product && product.id === id) setProduct({ ...product, ...updates });
    setLoading(false);
  };

  // 5. Deletar produto (Estava faltando!)
  const deleteProduct = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    // Remove da lista local para não precisar recarregar
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setLoading(false);
  };

  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProductsByMaker, // Agora existe e com o nome certo
    fetchProductById,
    updateProduct,
    deleteProduct // Agora existe
  };
}