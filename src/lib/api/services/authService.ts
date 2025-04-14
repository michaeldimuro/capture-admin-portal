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
    
    // Store tokens when login is successful
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },
  
  refreshToken: async (): Promise<{ accessToken: string, refreshToken: string }> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh', { refreshToken });
    
    // Update stored tokens
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
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