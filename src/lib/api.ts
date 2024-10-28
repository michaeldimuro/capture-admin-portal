import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030/dev', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'SUPERADMIN' | 'COMPANY_ADMIN';
    companyId?: string;
  };
  token: string;
}

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

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default api;