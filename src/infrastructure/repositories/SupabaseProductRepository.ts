import { supabase } from "../supabase/client";
import { IProductRepository } from "../../core/repositories/IProductRepository";
import { Product } from "../../core/entities/Product";

export class SupabaseProductRepository implements IProductRepository {
  // Mapeamento auxiliar: Banco (snake_case) -> Entidade (camelCase)
  private mapToEntity(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      type: data.type,
      imageUrl: data.image_url,    // Mapeando image_url -> imageUrl
      makerId: data.maker_id,      // Mapeando maker_id -> makerId
      stlFileUrl: data.stl_file_url, // Mapeando stl_file_url -> stlFileUrl
      stock: data.stock,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (error) return null;
    return this.mapToEntity(data);
  }

  async getByType(type: string): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*").eq("type", type);
    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  // --- IMPLEMENTAÇÃO NECESSÁRIA PARA "MEUS PRODUTOS" ---
  async getByMakerId(makerId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("maker_id", makerId); // Busca pela coluna correta do banco

    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async create(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    // Mapeamento Inverso: Entidade -> Banco
    const dbProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      type: product.type,
      image_url: product.imageUrl,     // Grava como image_url
      maker_id: product.makerId,       // Grava como maker_id
      stl_file_url: product.stlFileUrl, // Grava como stl_file_url
      stock: product.stock,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(dbProduct)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar produto:", error.message);
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }
}