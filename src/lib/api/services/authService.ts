import api from '../../apiClient';

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

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> => {
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh', { refreshToken });
    
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  },
  
  logout: async (): Promise<void> => {
    // Only performs backend logout operations if needed
    // Token cleanup is handled by the auth store
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Silently fail, logout should still proceed even if the API call fails
    }
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