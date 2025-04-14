import { useQuery } from '@tanstack/react-query'; // Assuming you're using React Query
import { companiesService } from '../lib/api/services';
import { queryKeys } from '../lib/api/queryKeys';

export function useCompanyOrders(companyId: string) {
  return useQuery({
    queryKey: queryKeys.companies.orders(companyId),
    queryFn: () => companiesService.getCompanyOrders(companyId),
    enabled: !!companyId,
  });
} 