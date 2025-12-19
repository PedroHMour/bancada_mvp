// src/infrastructure/repositories/SupabaseMakerRepository.ts
import { IMakerRepository } from "@/core/repositories/IMakerRepository";
import { Maker, MakerService, BankAccount, MakerCategory } from "@/core/entities/Maker";
// CORREÇÃO: Usando o mesmo client do AuthContext e ProductRepository
import { supabase } from "../supabase/client"; 

export class SupabaseMakerRepository implements IMakerRepository {
  async createMakerProfile(
    maker: Omit<Maker, "id" | "createdAt" | "updatedAt" | "services" | "bankAccount" | "rating" | "totalOrders" | "verified">
  ): Promise<Maker> {
    const { data, error } = await supabase
      .from("makers")
      .insert({
        user_id: maker.userId,
        business_name: maker.businessName,
        bio: maker.bio,
        categories: maker.categories,
        latitude: maker.latitude,
        longitude: maker.longitude,
        rating: 0,
        total_orders: 0,
        verified: false,
      })
      .select()
      .single();

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao criar perfil", error);
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }

  async updateMakerProfile(maker: Partial<Maker> & { id: string }): Promise<Maker> {
    const { data, error } = await supabase
      .from("makers")
      .update({
        business_name: maker.businessName,
        bio: maker.bio,
        categories: maker.categories,
        latitude: maker.latitude,
        longitude: maker.longitude,
        updated_at: new Date().toISOString(),
      })
      .eq("id", maker.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async getMakerByUserId(userId: string): Promise<Maker | null> {
    const { data, error } = await supabase
      .from("makers")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(); // Use maybeSingle para evitar erro se não existir

    if (error) throw new Error(error.message);
    if (!data) return null;

    // Busca dados relacionados
    const services = await this.getMakerServices(data.id);
    const bankAccount = await this.getBankAccountByMakerId(data.id);

    return { ...this.mapToEntity(data), services, bankAccount: bankAccount || undefined };
  }

  async getMakerById(id: string): Promise<Maker | null> {
    const { data, error } = await supabase.from("makers").select("*").eq("id", id).single();
    if (error) return null;
    
    const services = await this.getMakerServices(data.id);
    return { ...this.mapToEntity(data), services };
  }

  async getAllMakers(): Promise<Maker[]> {
    const { data, error } = await supabase.from("makers").select("*");
    if (error) throw new Error(error.message);
    // Nota: Em produção, evitar N+1 queries. Aqui mantemos simples.
    return Promise.all(data.map(async d => ({
       ...this.mapToEntity(d),
       services: await this.getMakerServices(d.id)
    })));
  }

  async listMakersByCategory(category: MakerCategory): Promise<Maker[]> {
    const { data, error } = await supabase.from("makers").select("*").contains("categories", [category]);
    if (error) throw new Error(error.message);
    return Promise.all(data.map(async d => ({
       ...this.mapToEntity(d),
       services: await this.getMakerServices(d.id)
    })));
  }

  async listNearby(lat: number, lng: number, radiusKm: number): Promise<Maker[]> {
     const { data, error } = await supabase.from("makers").select("*");
     if (error) throw new Error(error.message);
     // Filtragem simples no cliente
     const filtered = data.filter(d => {
        const distance = Math.sqrt(Math.pow(d.latitude - lat, 2) + Math.pow(d.longitude - lng, 2)) * 111;
        return distance <= radiusKm;
     });
     return Promise.all(filtered.map(async d => ({
        ...this.mapToEntity(d),
        services: await this.getMakerServices(d.id)
     })));
  }

  // --- Métodos Auxiliares de Serviço e Banco ---

  async addService(service: Omit<MakerService, "id">): Promise<MakerService> {
    const { data, error } = await supabase.from("maker_services").insert({
        maker_id: service.makerId,
        name: service.name,
        description: service.description,
        price: service.price,
    }).select().single();
    if (error) throw new Error(error.message);
    return this.mapServiceEntity(data);
  }

  async getMakerServices(makerId: string): Promise<MakerService[]> {
    const { data, error } = await supabase.from("maker_services").select("*").eq("maker_id", makerId);
    if (error) throw new Error(error.message);
    return data.map(this.mapServiceEntity);
  }

  async updateService(service: Partial<MakerService> & { id: string }): Promise<MakerService> {
    const { data, error } = await supabase.from("maker_services").update({
        name: service.name,
        description: service.description,
        price: service.price
    }).eq("id", service.id).select().single();
    if (error) throw new Error(error.message);
    return this.mapServiceEntity(data);
  }

  async deleteService(serviceId: string): Promise<void> {
    const { error } = await supabase.from("maker_services").delete().eq("id", serviceId);
    if (error) throw new Error(error.message);
  }

  async upsertBankAccount(makerId: string, bankAccount: Omit<BankAccount, "id">): Promise<BankAccount> {
      const { data, error } = await supabase.from("bank_accounts").upsert({
        maker_id: makerId,
        holder_name: bankAccount.holderName,
        cpf_or_cnpj: bankAccount.cpfOrCnpj,
        bank_code: bankAccount.bankCode,
        agency: bankAccount.agency,
        account_number: bankAccount.accountNumber,
        pix_key: bankAccount.pixKey
      }, { onConflict: 'maker_id' }).select().single();
      if (error) throw new Error(error.message);
      return this.mapBankEntity(data);
  }

  async getBankAccountByMakerId(makerId: string): Promise<BankAccount | null> {
      const { data, error } = await supabase.from("bank_accounts").select("*").eq("maker_id", makerId).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return null;
      return this.mapBankEntity(data);
  }

  // --- Mappers para evitar repetição ---
  private mapToEntity(data: any): Maker {
      return {
        id: data.id,
        userId: data.user_id,
        businessName: data.business_name,
        bio: data.bio,
        categories: data.categories,
        services: [], 
        latitude: data.latitude,
        longitude: data.longitude,
        rating: data.rating,
        totalOrders: data.total_orders,
        verified: data.verified,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
  }

  private mapServiceEntity(d: any): MakerService {
      return {
          id: d.id,
          makerId: d.maker_id,
          name: d.name,
          description: d.description || undefined,
          price: d.price || undefined,
      };
  }

  private mapBankEntity(d: any): BankAccount {
      return {
          id: d.id,
          holderName: d.holder_name,
          cpfOrCnpj: d.cpf_or_cnpj,
          bankCode: d.bank_code,
          agency: d.agency,
          accountNumber: d.account_number,
          pixKey: d.pix_key || undefined
      };
  }
}