export type ProductType = 'physical' | 'service';

export interface Product {
  id: string;
  makerId: string; // Importante: camelCase para alinhar com o código
  name: string;
  description: string;
  price: number;
  stock: number;
  type: ProductType;
  imageUrls: string[]; // Importante: camelCase
  createdAt?: string;
}