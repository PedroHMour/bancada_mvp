"use client";

import { useState, useCallback, useEffect } from "react";
import { SupabaseMakerRepository } from "@/infrastructure/repositories/SupabaseMakerRepository";
import { Maker, BankAccount } from "@/core/entities/Maker";
import { useAuth } from "@/presentation/contexts/AuthContext";

// Instância do repositório
const repo = new SupabaseMakerRepository();

export const useMakers = () => {
  const { user } = useAuth();
  const [makerProfile, setMakerProfile] = useState<Maker | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar dados do Maker logado
  const fetchMakerData = useCallback(async () => {
    if (!user) return;
    
    // Evita loop se já estiver carregando
    setLoading(true);
    setError(null);

    try {
      const profile = await repo.getMakerByUserId(user.id);
      setMakerProfile(profile);
      
      if (profile) {
        const bank = await repo.getBankAccountByMakerId(profile.id);
        setBankAccount(bank);
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados do maker:", err.message);
      // Não definimos erro crítico aqui para não quebrar a UI inteira se for apenas um delay
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carregar dados automaticamente quando o usuário muda
  useEffect(() => {
    fetchMakerData();
  }, [fetchMakerData]);

  // Criar Perfil
  const createProfile = async (data: any) => {
    if (!user) return;
    setLoading(true);
    try {
      const newProfile = await repo.createMakerProfile({ ...data, userId: user.id });
      setMakerProfile(newProfile);
      return newProfile;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar Perfil
  const updateProfile = async (data: any) => {
    setLoading(true);
    try {
      const updated = await repo.updateMakerProfile(data);
      setMakerProfile(updated);
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar/Criar Conta Bancária
  const upsertBankAccount = async (data: any) => {
    if (!makerProfile) return;
    setLoading(true);
    try {
      const bank = await repo.upsertBankAccount(makerProfile.id, data);
      setBankAccount(bank);
      return bank;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    makerProfile,
    bankAccount,
    loading,
    error,
    fetchMakerData,
    createProfile,
    updateProfile,
    upsertBankAccount
  };
};