import { useCompanyOrders } from '../../hooks/useCompanyOrders'; // Create this hook

export function OrdersTab({ companyId }: { companyId: string }) {
  const { data: orders, isLoading, error } = useCompanyOrders(companyId);

  if (isLoading) {
    return <div className="p-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Failed to load orders</div>;
  }

  if (!orders?.length) {
    return (
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-4">Order History</h3>
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-4">Order History</h3>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="border rounded-lg p-4">
            {/* Render order details */}
          </div>
        ))}
      </div>
    </div>
  );
} 