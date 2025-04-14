import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../lib/api/services';
import { queryKeys } from '../lib/api/queryKeys';
import { useAuthStore } from '../stores/authStore';

export function useDashboard() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardService.getStats,
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