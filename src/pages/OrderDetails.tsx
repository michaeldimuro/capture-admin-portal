import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { mockOrders } from '../data/mockData';
import { cn } from '../lib/utils';

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const order = mockOrders.find(order => order.id === id);

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
          <p className="mt-2 text-gray-600">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/orders')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-gray-600">Order ID: {order.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {order.status !== 'cancelled' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
            >
              Cancel Order
            </button>
          )}
          {order.status !== 'refunded' && (
            <button
              onClick={() => setShowRefundModal(true)}
              className="px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              Issue Refund
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Patient Name</p>
                <p className="font-medium">{order.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={cn(
                  "px-2 py-1 text-sm rounded-full",
                  getStatusColor(order.status)
                )}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Shipping Address</h3>
              <p className="text-gray-600">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Medication Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order.medication}</p>
                <p className="text-gray-600">Dosage: {order.dosage}</p>
                <p className="text-gray-600">Quantity: {order.quantity} units</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    {event.status === 'Order Placed' && <Package className="h-5 w-5 text-blue-500" />}
                    {event.status === 'Processing' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                    {event.status === 'Shipped' && <Truck className="h-5 w-5 text-purple-500" />}
                    {event.status === 'Delivered' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{event.status}</p>
                    <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Cancel Order</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                No, Keep Order
              </button>
              <button
                onClick={() => {
                  // Handle order cancellation
                  setShowCancelModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Issue Refund</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to issue a refund for this order?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle refund
                  setShowRefundModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Issue Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;