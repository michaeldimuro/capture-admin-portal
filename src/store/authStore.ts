import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN';
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'SUPER_ADMIN',
  },
  setUser: (user) => set({ user }),
}));