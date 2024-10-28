import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'SUPERADMIN' | 'COMPANY_ADMIN';

interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  companyId?: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => Promise<boolean>;
  logout: () => void;
}

// const mockUsers = [
//   {
//     id: '1',
//     role: 'SUPERADMIN' as UserRole,
//     name: 'John Admin',
//     email: 'admin@example.com',
//     password: 'admin123',
//   },
//   {
//     id: '2',
//     role: 'COMPANY_ADMIN' as UserRole,
//     name: 'Jane Company',
//     email: 'company@example.com',
//     password: 'company123',
//     companyId: 'c1',
//   },
// ];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (user: User) => {
        if (user) {
          set({ user });
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