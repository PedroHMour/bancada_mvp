// src/core/entities/Maker.ts
export enum MakerCategory {
  PRINTING = "Impressão 3D",
  MODELING = "Modelagem 3D",
  SLICING = "Fatiamento",
  FILAMENT_SELLER = "Venda de Filamentos",
  PRINTER_SELLER = "Venda de Impressoras",
  CONSULTING = "Consultoria Técnica",
}

export interface MakerService {
  id: string;
  makerId: string;
  name: string;
  description?: string;
  price?: number;
}

export interface BankAccount {
  id: string; // Adicionado ID para BankAccount
  holderName: string;
  cpfOrCnpj: string;
  bankCode: string;
  agency: string;
  accountNumber: string;
  pixKey?: string;
}

export interface Maker {
  id: string;
  userId: string;
  businessName: string;
  bio: string;
  categories: MakerCategory[];
  services: MakerService[];
  bankAccount?: BankAccount; // Opcional, pode não ter ainda
  latitude: number;
  longitude: number;
  rating: number;
  totalOrders: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
