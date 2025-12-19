import { Product } from "../entities/Product";

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getByType(type: string): Promise<Product[]>;
  getByMakerId(makerId: string): Promise<Product[]>;
  create(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product>;
  
  // --- ADICIONE ESTES DOIS MÉTODOS ---
  update(product: Partial<Product> & { id: string }): Promise<Product>;
  delete(id: string): Promise<void>;
}