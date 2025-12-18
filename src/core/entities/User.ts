export enum UserRole {
  CLIENT = 'client',
  MAKER = 'maker',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
