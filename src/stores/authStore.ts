import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'SUPERADMIN' | 'COMPANY_ADMIN';

interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  companyId?: string;
  tenantId?: string;
  schemaName?: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
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
    (set, get) => ({
      user: null,
      login: async (user: User) => {
        if (user) {
          set({ user });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
      isAuthenticated: () => {
        return !!get().user && !!localStorage.getItem('token');
      }
    }),
    {
      name: 'auth-storage',
      // Only persist the user data, not the token (handled separately)
      partialize: (state) => ({ user: state.user }),
    }
  )
);