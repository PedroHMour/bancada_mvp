// src/core/usecases/makers/AddMakerService.ts
import { IMakerRepository } from "@/core/repositories/IMakerRepository";
import { MakerService } from "@/core/entities/Maker";

export class AddMakerService {
  constructor(private repo: IMakerRepository) {}

  async execute(service: Omit<MakerService, "id">) {
    return await this.repo.addService(service);
  }
}
