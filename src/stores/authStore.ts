import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'SUPER_ADMIN' | 'COMPANY_ADMIN';

interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  companyId?: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const mockUsers = [
  {
    id: '1',
    role: 'SUPER_ADMIN' as UserRole,
    name: 'John Admin',
    email: 'admin@example.com',
    password: 'admin123',
  },
  {
    id: '2',
    role: 'COMPANY_ADMIN' as UserRole,
    name: 'Jane Company',
    email: 'company@example.com',
    password: 'company123',
    companyId: 'c1',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email: string, password: string) => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);