import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '../lib/api/services';
import { queryKeys } from '../lib/api/queryKeys';

export function useCompanyOrders(companyId: string) {
  return useQuery({
    queryKey: queryKeys.companies.orders(companyId),
    queryFn: () => companiesService.getCompanyOrders(companyId),
    enabled: !!companyId,
  });
}

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orders.details(orderId),
    queryFn: () => companiesService.getOrderDetails(orderId),
    enabled: !!orderId,
  });
}

export function useOrderActions() {
  const queryClient = useQueryClient();
  
  const refundOrder = useMutation({
    mutationFn: (params: { orderId: string; amount?: number; reason?: string }) => 
      companiesService.refundOrder(params.orderId, params.amount, params.reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.details(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.orders(variables.orderId) });
    },
  });

  const cancelOrder = useMutation({
    mutationFn: (params: { orderId: string; reason?: string }) => 
      companiesService.cancelOrder(params.orderId, params.reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.details(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.orders(variables.orderId) });
    },
  });

  return {
    refundOrder,
    cancelOrder,
  };
} 