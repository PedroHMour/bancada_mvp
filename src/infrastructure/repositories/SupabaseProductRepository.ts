import { supabase } from "../supabase/client";
import { IProductRepository } from "../../core/repositories/IProductRepository";
import { Product } from "../../core/entities/Product";

export class SupabaseProductRepository implements IProductRepository {
  
  private mapToEntity(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      type: data.type,
      // Garante que sempre seja um array
      imageUrls: data.image_urls || [], 
      makerId: data.maker_id,
      stlFileUrl: data.stl_file_url,
      stock: data.stock ?? 0,
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

  // --- O MÉTODO QUE FALTAVA ---
  async getByType(type: string): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*").eq("type", type);
    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }
  // -----------------------------

  async getByMakerId(makerId: string): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*").eq("maker_id", makerId);
    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async create(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const dbProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      type: product.type,
      image_urls: product.imageUrls, // Atenção aqui: image_urls
      maker_id: product.makerId,
      stl_file_url: product.stlFileUrl,
      stock: product.stock,
    };

    const { data, error } = await supabase.from("products").insert(dbProduct).select().single();
    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async update(product: Partial<Product> & { id: string }): Promise<Product> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    
    if (product.name !== undefined) dbUpdates.name = product.name;
    if (product.description !== undefined) dbUpdates.description = product.description;
    if (product.price !== undefined) dbUpdates.price = product.price;
    if (product.type !== undefined) dbUpdates.type = product.type;
    // Atualiza o array de imagens
    if (product.imageUrls !== undefined) dbUpdates.image_urls = product.imageUrls;
    if (product.stock !== undefined) dbUpdates.stock = product.stock;

    const { data, error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", product.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}