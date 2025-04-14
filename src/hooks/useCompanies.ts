import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '../lib/api/services';
import { queryKeys } from '../lib/api/queryKeys';
import type { Company } from '../types';

export function useCompanies() {
  const queryClient = useQueryClient();

  const companiesQuery = useQuery({
    queryKey: queryKeys.companies.all,
    queryFn: companiesService.getCompanies,
  });

  const createCompanyMutation = useMutation({
    mutationFn: companiesService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
    },
  });

  const setCompanyIntegrationConfigurations = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: {} }) =>
      companiesService.setCompanyConfigurationSettings(id, payload),
    onSuccess: (_, variables) => {
      // Invalidate the specific company and the list
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.companies.detail(variables.id) 
      });
    }
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      companiesService.updateCompany(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific company and the list
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.companies.detail(variables.id) 
      });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: companiesService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
    },
  });

  return {
    companies: companiesQuery.data,
    isLoading: companiesQuery.isLoading,
    isFetching: companiesQuery.isFetching,
    error: companiesQuery.error,
    setCompanyIntegrationConfigurations: setCompanyIntegrationConfigurations.mutate,
    createCompany: createCompanyMutation.mutate,
    updateCompany: updateCompanyMutation.mutate,
    deleteCompany: deleteCompanyMutation.mutate,
    isCreating: createCompanyMutation.isPending,
    isUpdating: updateCompanyMutation.isPending,
    isDeleting: deleteCompanyMutation.isPending,
  };
}