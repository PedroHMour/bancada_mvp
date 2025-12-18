// src/infrastructure/repositories/SupabaseProductRepository.ts

import { supabase } from "../supabase/client";
import { IProductRepository } from "../../core/repositories/IProductRepository";
import { Product } from "../../core/entities/Product";

export class SupabaseProductRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*");

    if (error) throw new Error(error.message);

    return data as Product[];
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return data as Product;
  }

  async getByType(type: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("type", type);

    if (error) throw new Error(error.message);

    return data as Product[];
  }

  async create(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as Product;
  }
}
