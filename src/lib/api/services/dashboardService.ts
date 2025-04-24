import api from '../../apiClient';

export interface DashboardStats {
  companies: {
    total: number;
    active: number;
    suspended: number;
    newThisMonth: number;
  };
  users: {
    total: number;
    newThisMonth: number;
  };
  orders: {
    total: number;
    newThisMonth: number;
  };
  patients: {
    total: number;
    newThisMonth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
  };
  intakes: {
    total: number;
    newThisMonth: number;
    completed: number;
    abandoned: number;
  };
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
}; 