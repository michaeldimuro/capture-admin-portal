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
  token: string | null;
  refreshToken: string | null;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setTokens: (token: string, refreshToken: string) => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
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
      token: null,
      refreshToken: null,
      login: (user, token, refreshToken) => set({ user, token, refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      getToken: () => get().token,
      getRefreshToken: () => get().refreshToken,
      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);