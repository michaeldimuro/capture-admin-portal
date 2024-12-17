export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
  },
  companies: {
    all: ['companies'] as const,
    detail: (id: string) => ['companies', id] as const,
    orders: (id: string) => ['companies', id, 'orders'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
} as const; 