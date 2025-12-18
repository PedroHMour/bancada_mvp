import { Product } from '../entities/Product';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getByType(type: string): Promise<Product[]>;
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
}
