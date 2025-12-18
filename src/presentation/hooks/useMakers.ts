// src/presentation/hooks/useMakers.ts
"use client";

import { useState, useCallback } from "react";
import { SupabaseMakerRepository } from "@/infrastructure/repositories/SupabaseMakerRepository";
import { CreateMakerProfile } from "@/core/usecases/makers/CreateMakerProfile";
import { UpdateMakerProfile } from "@/core/usecases/makers/UpdateMakerProfile";
import { AddMakerService } from "@/core/usecases/makers/AddMakerService";
import { Maker, MakerService, BankAccount } from "@/core/entities/Maker";
import { useAuth } from "@/presentation/contexts/AuthContext";

// Instanciar o repositório APENAS UMA VEZ
const repo = new SupabaseMakerRepository();

export const useMakers = () => {
  const { user } = useAuth();

  const [makerProfile, setMakerProfile] = useState<Maker | null>(null);
  const [makerServices, setMakerServices] = useState<MakerService[]>([]);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(false); // Este loading é para as operações do maker logado
  const [error, setError] = useState<string | null>(null); // Este error é para as operações do maker logado

  // --------- FUNÇÕES PARA MAKER LOGADO ---------

  const fetchMakerData = useCallback(async () => {
    if (!user?.id) {
      setMakerProfile(null);
      setMakerServices([]);
      setBankAccount(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const profile = await repo.getMakerByUserId(user.id);
      setMakerProfile(profile);
      if (profile) {
        setMakerServices(profile.services);
        setBankAccount(profile.bankAccount || null);
      }
    } catch (err: any) {
      console.error("useMakers: Erro em fetchMakerData", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // Depende apenas do user.id

  const createProfile = async (
    data: {
      userId: string;
      businessName: string;
      bio: string;
      categories: Maker["categories"];
      latitude: number;
      longitude: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const useCase = new CreateMakerProfile(repo);
      const result = await useCase.execute({
        ...data,
        services: [],
        bankAccount: undefined,
        rating: 0,
        totalOrders: 0,
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: "",
      } as any);
      setMakerProfile(result);
      return result;
    } catch (err: any) {
      console.error("useMakers: Erro em createProfile", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Maker> & { id: string }) => {
    setLoading(true);
    setError(null);
    try {
      const useCase = new UpdateMakerProfile(repo);
      const result = await useCase.execute(data);
      setMakerProfile(result);
      return result;
    } catch (err: any) {
      console.error("useMakers: Erro em updateProfile", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addService = async (service: Omit<MakerService, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const useCase = new AddMakerService(repo);
      const result = await useCase.execute(service);
      setMakerServices(prev => [...prev, result]);
      return result;
    } catch (err: any) {
      console.error("useMakers: Erro em addService", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (service: Partial<MakerService> & { id: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await repo.updateService(service);
      setMakerServices(prev => prev.map(s => s.id === result.id ? result : s));
      return result;
    } catch (err: any) {
      console.error("useMakers: Erro em updateService", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId: string) => {
    setLoading(true);
    setError(null);
    try {
      await repo.deleteService(serviceId);
      setMakerServices(prev => prev.filter(s => s.id !== serviceId));
    } catch (err: any) {
      console.error("useMakers: Erro em deleteService", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const upsertBankAccount = async (data: Omit<BankAccount, "id">) => {
    if (!makerProfile?.id) {
      const msg = "Perfil de maker não encontrado para salvar dados bancários.";
      setError(msg);
      throw new Error(msg);
    }
    setLoading(true);
    setError(null);
    try {
      const result = await repo.upsertBankAccount(makerProfile.id, data);
      setBankAccount(result);
      return result;
    } catch (err: any) {
      console.error("useMakers: Erro em upsertBankAccount", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --------- FUNÇÕES PURAS PARA PÁGINAS PÚBLICAS / MARKETPLACE ---------
  // Estas funções não alteram o estado global de loading/error do hook,
  // mas sim retornam os dados e a página que as chama gerencia seu próprio loading/error.

  const getAllMakers = useCallback(async () => {
    try {
      return await repo.getAllMakers();
    } catch (err: any) {
      console.error("useMakers: Erro em getAllMakers (público)", err);
      throw err;
    }
  }, []); // Sem dependências, função estável

  const getMakerById = useCallback(async (id: string) => {
    try {
      return await repo.getMakerById(id);
    } catch (err: any) {
      console.error("useMakers: Erro em getMakerById (público)", err);
      throw err;
    }
  }, []); // Sem dependências, função estável

  return {
    // estado do maker logado
    makerProfile,
    makerServices,
    bankAccount,
    loading, // Este loading é para as operações do maker logado
    error,   // Este error é para as operações do maker logado

    // maker logado
    fetchMakerData,
    createProfile,
    updateProfile,
    addService,
    updateService,
    deleteService,
    upsertBankAccount,

    // público / marketplace
    getAllMakers,
    getMakerById,
  };
};
