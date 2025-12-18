export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ProductType;
  imageUrl: string;
  makerId?: string;
  stlFileUrl?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}
