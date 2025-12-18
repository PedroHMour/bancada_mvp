import { User } from '../entities/User';

export interface IUserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
}
