// src/infrastructure/repositories/SupabaseMakerRepository.ts
import { IMakerRepository } from "@/core/repositories/IMakerRepository";
import { Maker, MakerService, BankAccount, MakerCategory } from "@/core/entities/Maker";
import { createClient } from "@/lib/supabase/client"; // Usando o cliente de browser

// Instanciar o cliente Supabase APENAS UMA VEZ
const supabase = createClient();

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
      console.error("SupabaseMakerRepository: Erro ao criar perfil do maker", error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      userId: data.user_id,
      businessName: data.business_name,
      bio: data.bio,
      categories: data.categories,
      services: [], // Inicializa vazio, será populado por getMakerServices
      latitude: data.latitude,
      longitude: data.longitude,
      rating: data.rating,
      totalOrders: data.total_orders,
      verified: data.verified,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async updateMakerProfile(
    maker: Partial<Maker> & { id: string }
  ): Promise<Maker> {
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

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao atualizar perfil do maker", error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      userId: data.user_id,
      businessName: data.business_name,
      bio: data.bio,
      categories: data.categories,
      services: [], // Inicializa vazio
      latitude: data.latitude,
      longitude: data.longitude,
      rating: data.rating,
      totalOrders: data.total_orders,
      verified: data.verified,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getMakerByUserId(userId: string): Promise<Maker | null> {
    const { data, error } = await supabase
      .from("makers")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("SupabaseMakerRepository: Erro ao buscar maker por user ID", error);
      throw new Error(error.message);
    }
    if (!data) return null;

    const services = await this.getMakerServices(data.id);
    const bankAccount = await this.getBankAccountByMakerId(data.id);

    return {
      id: data.id,
      userId: data.user_id,
      businessName: data.business_name,
      bio: data.bio,
      categories: data.categories,
      services: services,
      latitude: data.latitude,
      longitude: data.longitude,
      rating: data.rating,
      totalOrders: data.total_orders,
      verified: data.verified,
      bankAccount: bankAccount || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getMakerById(id: string): Promise<Maker | null> {
    const { data, error } = await supabase
      .from("makers")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("SupabaseMakerRepository: Erro ao buscar maker por ID", error);
      throw new Error(error.message);
    }
    if (!data) return null;

    const services = await this.getMakerServices(data.id);

    return {
      id: data.id,
      userId: data.user_id,
      businessName: data.business_name,
      bio: data.bio,
      categories: data.categories,
      services: services,
      latitude: data.latitude,
      longitude: data.longitude,
      rating: data.rating,
      totalOrders: data.total_orders,
      verified: data.verified,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getAllMakers(): Promise<Maker[]> {
    const { data, error } = await supabase
      .from("makers")
      .select("*");

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao buscar todos os makers", error);
      throw new Error(error.message);
    }
    if (!data) return [];

    const makersWithServices = await Promise.all(data.map(async (d) => {
      const services = await this.getMakerServices(d.id);
      return {
        id: d.id,
        userId: d.user_id,
        businessName: d.business_name,
        bio: d.bio,
        categories: d.categories,
        services: services,
        latitude: d.latitude,
        longitude: d.longitude,
        rating: d.rating,
        totalOrders: d.total_orders,
        verified: d.verified,
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.updated_at),
      };
    }));

    return makersWithServices;
  }

  async listMakersByCategory(category: MakerCategory): Promise<Maker[]> {
    const { data, error } = await supabase
      .from("makers")
      .select("*")
      .contains("categories", [category]);

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao listar makers por categoria", error);
      throw new Error(error.message);
    }
    if (!data) return [];

    const makersWithServices = await Promise.all(data.map(async (d) => {
      const services = await this.getMakerServices(d.id);
      return {
        id: d.id,
        userId: d.user_id,
        businessName: d.business_name,
        bio: d.bio,
        categories: d.categories,
        services: services,
        latitude: d.latitude,
        longitude: d.longitude,
        rating: d.rating,
        totalOrders: d.total_orders,
        verified: d.verified,
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.updated_at),
      };
    }));

    return makersWithServices;
  }

  async listNearby(
    lat: number,
    lng: number,
    radiusKm: number
  ): Promise<Maker[]> {
    // Implementação simplificada, pode ser otimizada com PostGIS no Supabase
    const { data, error } = await supabase.from("makers").select("*");

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao listar makers próximos", error);
      throw new Error(error.message);
    }
    if (!data) return [];

    const nearbyMakers = data.filter(d => {
      // Cálculo de distância euclidiana simplificado (não preciso de precisão geográfica aqui)
      const distance = Math.sqrt(
        Math.pow(d.latitude - lat, 2) + Math.pow(d.longitude - lng, 2)
      ) * 111; // Aproximação para km
      return distance <= radiusKm;
    });

    const makersWithServices = await Promise.all(nearbyMakers.map(async (d) => {
      const services = await this.getMakerServices(d.id);
      return {
        id: d.id,
        userId: d.user_id,
        businessName: d.business_name,
        bio: d.bio,
        categories: d.categories,
        services: services,
        latitude: d.latitude,
        longitude: d.longitude,
        rating: d.rating,
        totalOrders: d.total_orders,
        verified: d.verified,
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.updated_at),
      };
    }));

    return makersWithServices;
  }

  async addService(
    service: Omit<MakerService, "id">
  ): Promise<MakerService> {
    const { data, error } = await supabase
      .from("maker_services")
      .insert({
        maker_id: service.makerId,
        name: service.name,
        description: service.description,
        price: service.price,
      })
      .select()
      .single();

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao adicionar serviço", error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      makerId: data.maker_id,
      name: data.name,
      description: data.description || undefined,
      price: data.price || undefined,
    };
  }

  async getMakerServices(makerId: string): Promise<MakerService[]> {
    const { data, error } = await supabase
      .from("maker_services")
      .select("*")
      .eq("maker_id", makerId);

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao buscar serviços do maker", error);
      throw new Error(error.message);
    }
    if (!data) return [];

    return data.map((d) => ({
      id: d.id,
      makerId: d.maker_id,
      name: d.name,
      description: d.description || undefined,
      price: d.price || undefined,
    }));
  }

  async updateService(service: Partial<MakerService> & { id: string }): Promise<MakerService> {
    const { data, error } = await supabase
      .from("maker_services")
      .update({
        name: service.name,
        description: service.description,
        price: service.price,
      })
      .eq("id", service.id)
      .select()
      .single();

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao atualizar serviço", error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      makerId: data.maker_id,
      name: data.name,
      description: data.description || undefined,
      price: data.price || undefined,
    };
  }

  async deleteService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from("maker_services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao deletar serviço", error);
      throw new Error(error.message);
    }
  }

  async upsertBankAccount(makerId: string, bankAccount: Omit<BankAccount, "id">): Promise<BankAccount> {
    const { data, error } = await supabase
      .from("bank_accounts")
      .upsert({
        maker_id: makerId,
        holder_name: bankAccount.holderName,
        cpf_or_cnpj: bankAccount.cpfOrCnpj,
        bank_code: bankAccount.bankCode,
        agency: bankAccount.agency,
        account_number: bankAccount.accountNumber,
        pix_key: bankAccount.pixKey,
      }, { onConflict: 'maker_id' })
      .select()
      .single();

    if (error) {
      console.error("SupabaseMakerRepository: Erro ao salvar dados bancários", error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      holderName: data.holder_name,
      cpfOrCnpj: data.cpf_or_cnpj,
      bankCode: data.bank_code,
      agency: data.agency,
      accountNumber: data.account_number,
      pixKey: data.pix_key || undefined,
    };
  }

  async getBankAccountByMakerId(makerId: string): Promise<BankAccount | null> {
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("maker_id", makerId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("SupabaseMakerRepository: Erro ao buscar dados bancários", error);
      throw new Error(error.message);
    }
    if (!data) return null;

    return {
      id: data.id,
      holderName: data.holder_name,
      cpfOrCnpj: data.cpf_or_cnpj,
      bankCode: data.bank_code,
      agency: data.agency,
      accountNumber: data.account_number,
      pixKey: data.pix_key || undefined,
    };
  }
}
