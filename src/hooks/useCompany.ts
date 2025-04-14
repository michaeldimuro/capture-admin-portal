import { useQuery } from '@tanstack/react-query';
import { companiesService } from '../lib/api/services';
import { queryKeys } from '../lib/api/queryKeys';

export function useCompany(id: string) {
  return useQuery({
    queryKey: queryKeys.companies.detail(id),
    queryFn: () => companiesService.getCompany(id),
    enabled: !!id,
  });
}