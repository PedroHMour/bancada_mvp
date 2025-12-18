// src/core/usecases/makers/CreateMakerProfile.ts
import { IMakerRepository } from "@/core/repositories/IMakerRepository";
import { Maker } from "@/core/entities/Maker";

export class CreateMakerProfile {
  constructor(private repo: IMakerRepository) {}

  async execute(maker: Omit<Maker, "id" | "createdAt" | "updatedAt" | "services" | "rating" | "totalOrders" | "verified">) {
    return await this.repo.createMakerProfile(maker);
  }
}
