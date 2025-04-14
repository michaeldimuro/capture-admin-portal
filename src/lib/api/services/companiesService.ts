import api from '../../apiClient';
import { Company } from '../../../types';

export const companiesService = {
  getCompanies: async (): Promise<any> => {
    const response = await api.get('/admin/tenants');
    return response.data;
  },

  getCompany: async (id: string): Promise<any> => {
    const response = await api.get(`/admin/tenants/${id}`);
    return response.data;
  },
  
  setCompanyConfigurationSettings: async (id: string, payload: {}): Promise<any> => {
    const response = await api.post(`/admin/tenants/${id}/integration-configuration`, payload);
    return response.data;
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
  
  getOrderDetails: async (orderId: string): Promise<any> => {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  },
  
  refundOrder: async (orderId: string, amount?: number, reason?: string): Promise<any> => {
    const response = await api.post(`/admin/orders/${orderId}/refund`, { amount, reason });
    return response.data;
  },
  
  cancelOrder: async (orderId: string, reason?: string): Promise<any> => {
    const response = await api.post(`/admin/orders/${orderId}/cancel`, { reason });
    return response.data;
  }
}; 