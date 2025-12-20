export type UserRole = 'maker' | 'client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  whatsapp?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
}

export type ProductType = 'physical' | 'service';

export interface Product {
  id: string;
  maker_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  type: ProductType;
  image_urls: string[];
  created_at: string;
  
  // Campos para compatibilidade (Evita usar 'any')
  imageUrls?: string[]; 
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  client_id: string;
  maker_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';
  total: number;
  created_at: string;
}