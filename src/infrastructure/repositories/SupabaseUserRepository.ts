// src/infrastructure/repositories/SupabaseUserRepository.ts

import { supabase } from "../supabase/client";
import { IUserRepository } from "../../core/repositories/IUserRepository";
import { User } from "../../core/entities/User";

export class SupabaseUserRepository implements IUserRepository {
  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return data as User;
  }

  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return null;

    return data as User;
  }

  async create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as User;
  }
}
