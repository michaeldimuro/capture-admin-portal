import axios from 'axios';
import { Company } from '../types';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`, // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store refresh token in memory (more secure than localStorage)
let refreshToken = localStorage.getItem('refreshToken') || null;
let isRefreshing = false;

// Define the queue item interface
interface QueueItem {
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}

let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || '');
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is not 401 or it's already retried, reject
    if (
      error.response?.status !== 401 || 
      originalRequest._retry || 
      error.response?.data?.code !== 'TOKEN_EXPIRED' ||
      !refreshToken
    ) {
      return Promise.reject(error);
    }
    
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
      .then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      })
      .catch(err => {
        return Promise.reject(err);
      });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Call the refresh token endpoint
      const response = await api.post('/auth/refresh', { refreshToken });
      const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem('token', newToken);
      refreshToken = newRefreshToken;
      localStorage.setItem('refreshToken', newRefreshToken);
      
      // Update authorization header for the original request
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      
      // Process any queued requests
      processQueue(null, newToken);
      
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      refreshToken = null;
      
      // Trigger logout event
      window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export interface LoginResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'SUPERADMIN' | 'COMPANY_ADMIN';
    companyId?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
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
    
    // Store tokens when login is successful
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      refreshToken = response.data.refreshToken;
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },
  
  refreshToken: async (): Promise<{ accessToken: string, refreshToken: string }> => {
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh', { refreshToken });
    
    // Update stored tokens
    localStorage.setItem('token', response.data.accessToken);
    refreshToken = response.data.refreshToken;
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    refreshToken = null;
  },
  
  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/validate', { token });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
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