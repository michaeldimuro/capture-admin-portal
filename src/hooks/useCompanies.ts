import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi } from '../lib/api';
import type { Company } from '../types';

export function useCompanies() {
  const queryClient = useQueryClient();

  const companiesQuery = useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.getCompanies,
  });

  const createCompanyMutation = useMutation({
    mutationFn: companiesApi.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      companiesApi.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: companiesApi.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  return {
    companies: companiesQuery.data,
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error,
    createCompany: createCompanyMutation.mutate,
    updateCompany: updateCompanyMutation.mutate,
    deleteCompany: deleteCompanyMutation.mutate,
    isCreating: createCompanyMutation.isPending,
    isUpdating: updateCompanyMutation.isPending,
    isDeleting: deleteCompanyMutation.isPending,
  };
}