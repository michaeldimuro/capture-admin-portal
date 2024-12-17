// import { apiClient } from '../../client';
// import type { Company } from '../../../types';

// export class AdminTenantsService {
//   static getAll() {
//     return apiClient.get<Company[]>('/admin/tenants');
//   }

//   static getById(id: string) {
//     return apiClient.get<Company>(`/admin/tenants/${id}`);
//   }

//   static create(data: {
//     name: string;
//     owner: {
//       name: string;
//       email: string;
//       password: string;
//     };
//   }) {
//     return apiClient.post<Company>('/admin/tenants', data);
//   }

//   static update(id: string, data: Partial<Company>) {
//     return apiClient.patch<Company>(`/admin/tenants/${id}`, data);
//   }

//   static delete(id: string) {
//     return apiClient.delete(`/admin/tenants/${id}`);
//   }

//   static getOrders(id: string) {
//     return apiClient.get(`/admin/tenants/${id}/orders`);
//   }
// } 