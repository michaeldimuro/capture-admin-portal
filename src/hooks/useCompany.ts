import { useQuery } from '@tanstack/react-query';
import { companiesApi } from '../lib/api';

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => companiesApi.getCompany(id),
    enabled: !!id,
  });
}