export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Order {
  id: string;
  userId: string;
  makerId?: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
