import axios from 'axios';
import { Company } from '../types';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`, // Replace with your actual API URL
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

export const companiesApi = {
  getCompanies: async (): Promise<any> => {
    const response = await api.get('/admin/tenants');
    return response.data;
  },

  getCompany: async (id: string): Promise<any> => {
    const response = await api.get(`/admin/tenants/${id}`);
    return response.data;
  },
  setCompanyConfigurationSettings: async (id: string, payload: {}): Promise<any> => {
    const response = await api.post(`/admin/tenants/${id}/integration-configuration`, payload)
    return response.data
  },

  createCompany: async (data: {
    name: string;
    owner: {
      name: string;
      email: string;
      password: string;
    };
  }): Promise<Company> => {
    const response = await api.post('/admin/tenants', data);
    return response.data;
  },

  updateCompany: async (id: string, data: Partial<Company>): Promise<Company> => {
    const response = await api.patch(`/admin/tenants/${id}`, data);
    return response.data;
  },

  deleteCompany: async (id: string): Promise<void> => {
    await api.delete(`/admin/tenants/${id}`);
  },

  getCompanyOrders: async (id: string): Promise<any> => {
    const response = await api.get(`/admin/tenants/${id}/orders`);
    return response.data;
  },
};

export default api;