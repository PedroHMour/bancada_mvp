// src/core/repositories/IMakerRepository.ts
import { Maker, MakerService, BankAccount, MakerCategory } from "../entities/Maker"; // <<-- ADICIONADO MakerCategory

export interface IMakerRepository {
  createMakerProfile(maker: Omit<Maker, "id" | "createdAt" | "updatedAt" | "services" | "bankAccount" | "rating" | "totalOrders" | "verified">): Promise<Maker>;
  updateMakerProfile(maker: Partial<Maker> & { id: string }): Promise<Maker>;
  getMakerByUserId(userId: string): Promise<Maker | null>;
  getMakerById(id: string): Promise<Maker | null>;
  getAllMakers(): Promise<Maker[]>;
  listMakersByCategory(category: MakerCategory): Promise<Maker[]>;
  listNearby(lat: number, lng: number, radiusKm: number): Promise<Maker[]>;

  addService(service: Omit<MakerService, "id">): Promise<MakerService>;
  getMakerServices(makerId: string): Promise<MakerService[]>;
  updateService(service: Partial<MakerService> & { id: string }): Promise<MakerService>;
  deleteService(serviceId: string): Promise<void>;

  upsertBankAccount(makerId: string, bankAccount: Omit<BankAccount, "id">): Promise<BankAccount>;
  getBankAccountByMakerId(makerId: string): Promise<BankAccount | null>;
}
