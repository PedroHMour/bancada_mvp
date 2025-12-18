// src/core/entities/Cart.ts
import { MakerService } from "./Maker";

export interface CartItem {
  serviceId: string;
  makerId: string;
  serviceName: string;
  makerName: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
