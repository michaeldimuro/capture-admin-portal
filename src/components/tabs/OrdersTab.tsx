import { useCompanyOrders } from '../../hooks/useCompanyOrders'; // Create this hook
import { Package, Calendar, Clock, User } from 'lucide-react';

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

interface Offering {
  id: string;
  offeringName: string;
  offeringDescription: string;
  price: number;
  quantity: number;
  monthSupply: number;
  offeringImageUrl: string | null;
}

interface Order {
  id: string;
  orderCode: string;
  patientId: string;
  offeringId: string;
  companyId: string;
  chargeAmount: number;
  taxedAmount: number;
  mdiCaseId: string;
  shippingId: string;
  holdReleased: boolean;
  refunded: boolean;
  cancelled: boolean;
  authorizeNetTransactionId: string;
  authorizeNetSubscriptionId: string;
  subscriptionOccurrences: number | null;
  subscriptionIntervalMonths: number | null;
  paymentMethodId: string;
  patient: Patient;
  orderStatusUpdates: OrderStatusUpdate[];
  recentStatus: string;
  createdAt: string;
  offering: Offering;
}

export function OrdersTab({ companyId }: { companyId: string }) {
  const { data: orders, isLoading, error } = useCompanyOrders(companyId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center items-center h-44">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 animate-pulse">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-100">
          Failed to load orders
        </div>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Order History
        </h3>
        <div className="text-gray-500 p-8 bg-gray-50 rounded-lg border border-gray-100 text-center">
          <p className="mb-2">No orders found for this company.</p>
          <p className="text-sm text-gray-400">When orders are placed, they will appear here.</p>
        </div>
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
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-medium text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-500" />
        Order History
      </h3>
      <div className="space-y-4">
        {orders.map((order: Order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <div className="flex flex-col gap-4">
              {/* Order header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pb-3 border-b border-gray-100">
                {/* Left Side - Patient Info */}
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 rounded-full p-2.5">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{order.patient.firstName} {order.patient.lastName}</h4>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      {order.patient.email} • {order.patient.phoneNumber}
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Order Status */}
                <div className="flex items-center">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                    {formatStatus(order.recentStatus)}
                  </span>
                </div>
              </div>

              {/* Order details */}
              <div className="flex flex-col md:flex-row gap-5">
                {/* Offering details */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-50 rounded-lg p-2.5 mt-1">
                      <Package className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{order.offering.offeringName}</h4>
                      <p className="text-sm text-gray-500 mt-1">{order.offering.offeringDescription}</p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 mr-1">Quantity:</span>
                          <span className="font-medium text-gray-800">{order.offering.quantity} pills</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 mr-1">Supply:</span>
                          <span className="font-medium text-gray-800">{order.offering.monthSupply} month</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 mr-1">Order #:</span>
                          <span className="font-medium text-gray-800">{order.orderCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order meta information */}
                <div className="flex flex-row md:flex-col md:w-48 items-start md:items-end justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${order.chargeAmount.toFixed(2)}
                  </div>
                  {order.subscriptionIntervalMonths && (
                    <div className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full mt-2">
                      Subscription ({order.subscriptionIntervalMonths} month)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 