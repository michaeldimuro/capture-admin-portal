import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export function useDashboard() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
    select: (data) => {
      // Filter data based on user role
      if (user?.role === 'COMPANY_ADMIN') {
        const { companies, ...rest } = data;
        return rest;
      }
      return data;
    },
  });
}