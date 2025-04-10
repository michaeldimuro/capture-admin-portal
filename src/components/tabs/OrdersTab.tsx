import { useCompanyOrders } from '../../hooks/useCompanyOrders'; // Create this hook

// Define the Order type based on the sample data
interface Patient {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface OrderStatusUpdate {
  status: string;
}

interface Order {
  id: string;
  orderCode: string;
  patientId: string;
  chargeAmount: number;
  patient: Patient;
  orderStatusUpdates: OrderStatusUpdate[];
  recentStatus: string;
  createdAt: string;
}

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

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to format the status for display
  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-6">Order History</h3>
      <div className="space-y-4">
        {orders.map((order: Order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              {/* Left Side - Patient & Order Info */}
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 rounded-full p-3 hidden sm:flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{order.patient.firstName} {order.patient.lastName}</h4>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="text-gray-500">Order #</span>
                    <span className="ml-1 text-gray-700 font-medium">{order.orderCode}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                      {formatStatus(order.recentStatus)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Price & Date */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center">
                <div className="text-sm text-gray-500 flex items-center gap-1 md:mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${order.chargeAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 