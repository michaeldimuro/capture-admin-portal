import { useState } from 'react';
import { useCompanyOrders, useOrderDetails, useOrderActions } from '../../hooks/useCompanyOrders';
import { Package, Calendar, Clock, User, X, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';

// Define the Order type based on the sample data
interface Patient {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface OrderStatusUpdate {
  status: string;
  createdAt: string;
  sourceType: string;
  metadata?: any;
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number | undefined>(undefined);
  const [refundReason, setRefundReason] = useState<string>('');
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [expandedStatusId, setExpandedStatusId] = useState<string | null>(null);

  const { data: orderDetails, isLoading: isLoadingDetails } = useOrderDetails(selectedOrderId || '');
  const { refundOrder, cancelOrder } = useOrderActions();

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

  // Helper function to format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to format the status for display
  const formatStatus = (status: string) => {
    return !status ? 'No Status' : status
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleRefund = async () => {
    await refundOrder.mutateAsync({ 
      orderId: selectedOrderId!, 
      amount: refundAmount,
      reason: refundReason 
    });
    setIsRefundModalOpen(false);
    setRefundAmount(undefined);
    setRefundReason('');
  };

  const handleCancel = async () => {
    await cancelOrder.mutateAsync({ 
      orderId: selectedOrderId!,
      reason: cancelReason 
    });
    setIsCancelModalOpen(false);
    setCancelReason('');
  };

  const toggleStatusExpansion = (id: string) => {
    if (expandedStatusId === id) {
      setExpandedStatusId(null);
    } else {
      setExpandedStatusId(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-medium text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-500" />
        Order History
      </h3>
      <div className="space-y-4">
        {orders.map((order: Order) => (
          <div 
            key={order.id} 
            className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white cursor-pointer"
            onClick={() => setSelectedOrderId(order.id)}
          >
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
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    order.refunded ? 'bg-red-50 text-red-700' : 
                    order.cancelled ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {order.refunded ? 'Refunded' : 
                     order.cancelled ? 'Cancelled' : 
                     formatStatus(order.recentStatus)}
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

      {/* Order Details Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <button 
                onClick={() => setSelectedOrderId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {isLoadingDetails ? (
                <div className="flex justify-center items-center h-44">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : !orderDetails ? (
                <div className="text-red-500">Failed to load order details</div>
              ) : (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-medium">{orderDetails.orderCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date Placed</p>
                        <p className="font-medium">{formatDate(orderDetails.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className={`font-medium ${
                          orderDetails.refunded ? 'text-red-600' : 
                          orderDetails.cancelled ? 'text-gray-600' : 
                          'text-blue-600'
                        }`}>
                          {orderDetails.refunded ? 'Refunded' : 
                           orderDetails.cancelled ? 'Cancelled' : 
                           formatStatus(orderDetails.recentStatus)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons - Moved to top */}
                    {!orderDetails.cancelled && !orderDetails.refunded && (
                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          onClick={() => setIsCancelModalOpen(true)}
                        >
                          Cancel Order
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={() => {
                            setRefundAmount(orderDetails.chargeAmount);
                            setIsRefundModalOpen(true);
                          }}
                        >
                          Refund Order
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Patient Information */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Patient Information</h3>
                    <div className="bg-gray-50 rounded-lg p-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{orderDetails.patient.firstName} {orderDetails.patient.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{orderDetails.patient.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{orderDetails.patient.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Item */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                    <div className="bg-gray-50 rounded-lg p-5">
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="bg-white shadow-sm rounded-lg p-2 w-20 h-20 flex items-center justify-center">
                          {orderDetails.offering.offeringImageUrl ? (
                            <img 
                              src={orderDetails.offering.offeringImageUrl} 
                              alt={orderDetails.offering.offeringName}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{orderDetails.offering.offeringName}</h4>
                          <p className="text-sm text-gray-500 mt-1">{orderDetails.offering.offeringDescription}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                            <div className="flex items-center text-sm">
                              <span className="text-gray-500 mr-1">Quantity:</span>
                              <span className="font-medium text-gray-800">{orderDetails.offering.quantity} pills</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="text-gray-500 mr-1">Supply:</span>
                              <span className="font-medium text-gray-800">{orderDetails.offering.monthSupply} month</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${orderDetails.chargeAmount.toFixed(2)}</p>
                          {orderDetails.subscriptionIntervalMonths && (
                            <div className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full mt-2">
                              Subscription ({orderDetails.subscriptionIntervalMonths} month)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Tracking - In Accordion */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Order Tracking</h3>
                    <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                      {orderDetails.orderStatusUpdates?.length > 0 ? (
                        orderDetails.orderStatusUpdates.map((update: OrderStatusUpdate, index: number) => {
                          const statusId = `status-${index}`;
                          const isExpanded = expandedStatusId === statusId;
                          
                          return (
                            <div key={index} className="p-4">
                              <div 
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleStatusExpansion(statusId)}
                              >
                                <div className="flex items-center gap-3">
                                  {isExpanded ? 
                                    <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                  }
                                  <div className="flex-shrink-0 w-1 h-5 bg-blue-400 rounded"></div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{formatStatus(update.status)}</h4>
                                    <div className="text-xs text-gray-500">{formatDate(update.createdAt)} at {formatTime(update.createdAt)}</div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full">
                                  Source: {update.sourceType}
                                </div>
                              </div>
                              
                              {isExpanded && update.metadata && (
                                <div className="mt-3 ml-11 p-3 bg-gray-100 rounded-lg">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Details:</h5>
                                  <div className="text-sm text-gray-600 whitespace-pre-wrap overflow-auto max-h-60">
                                    {typeof update.metadata === 'object' 
                                      ? Object.entries(update.metadata).map(([key, value]) => (
                                          <div key={key} className="mb-1">
                                            <span className="font-medium">{key}: </span>
                                            <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                          </div>
                                        ))
                                      : update.metadata
                                    }
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 text-center py-4">No status updates available</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Refund Order</h3>
              <button 
                onClick={() => setIsRefundModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Amount
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Refund
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-md">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm">This action cannot be undone.</p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsRefundModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={handleRefund}
                  disabled={refundOrder.isPending}
                >
                  {refundOrder.isPending ? 'Processing...' : 'Process Refund'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm">This action cannot be undone and may affect inventory and patient service.</p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsCancelModalOpen(false)}
                >
                  Go Back
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={handleCancel}
                  disabled={cancelOrder.isPending}
                >
                  {cancelOrder.isPending ? 'Processing...' : 'Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 