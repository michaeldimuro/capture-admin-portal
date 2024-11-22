import { useQuery } from '@tanstack/react-query'; // Assuming you're using React Query
import { companiesApi } from '../lib/api';

export function useCompanyOrders(companyId: string) {
  return useQuery({
    queryKey: ['company', companyId, 'orders'],
    queryFn: () => companiesApi.getCompanyOrders(companyId),
    enabled: !!companyId,
  });
} 