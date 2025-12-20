// src/core/entities/Product.ts

// Enum para o tipo de produto
export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service'
}

// Interface principal do produto
export interface Product {
  id: string;
  makerId: string;
  name: string;
  description?: string;
  price: number;
  type: ProductType; // Usa o enum exportado acima
  imageUrls: string[]; // Garanta que é string[]
  stlFileUrl?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}