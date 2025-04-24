import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardStats } from '../lib/api/services/dashboardService';
import { queryKeys } from '../lib/api/queryKeys';
import { useAuthStore } from '../stores/authStore';

export function useDashboard() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardService.getStats,
    select: (data: DashboardStats) => {
      // Filter data based on user role
      if (user?.role !== 'SUPERADMIN') {
        const { companies, ...rest } = data;
        return rest;
      }
      return data;
    },
  });
}