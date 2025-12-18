// src/core/usecases/makers/UpdateMakerProfile.ts
import { IMakerRepository } from "@/core/repositories/IMakerRepository";
import { Maker } from "@/core/entities/Maker";

export class UpdateMakerProfile {
  constructor(private repo: IMakerRepository) {}

  async execute(data: Partial<Maker> & { id: string }) {
    return await this.repo.updateMakerProfile(data);
  }
}
