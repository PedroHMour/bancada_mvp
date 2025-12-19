export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service'
}

export interface Product {
  id: string;
  makerId: string;
  name: string;
  description?: string;
  price: number;
  type: ProductType;
  // MUDANÇA AQUI: De string opcional para array de strings obrigatório (pode ser vazio)
  imageUrls: string[]; 
  stlFileUrl?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}