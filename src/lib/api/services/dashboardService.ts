import api from '../../apiClient';

export interface DashboardStats {
  companies?: number;
  activeMedications?: number;
  totalPatients: number;
  activeOrders: number;
  monthlyRevenue: number;
  recentOrders: Array<{
    id: string;
    patient: string;
    medication: string;
    status: string;
  }>;
  alerts: Array<{
    id: number;
    type: 'warning' | 'info' | 'success';
    message: string;
  }>;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
}; 