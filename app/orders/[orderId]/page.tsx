'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OrderDetails {
  id: string;
  status: string;
  amount: number;
  createdAt: string;
  customerEmail: string;
  productId: string;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const orderDoc = await getDoc(doc(db, 'orders', params.orderId as string));
        
        if (!orderDoc.exists()) {
          setError('Order not found');
          return;
        }

        setOrder({
          id: orderDoc.id,
          ...orderDoc.data(),
        } as OrderDetails);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.orderId]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdating(true);
      setError(null);

      await updateDoc(doc(db, 'orders', order.id), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const updateTrackingNumber = async (trackingNumber: string) => {
    if (!order) return;

    try {
      setUpdating(true);
      setError(null);

      await updateDoc(doc(db, 'orders', order.id), {
        trackingNumber,
        updatedAt: new Date().toISOString(),
      });

      setOrder(prev => prev ? { ...prev, trackingNumber } : null);
    } catch (err) {
      console.error('Error updating tracking number:', err);
      setError('Failed to update tracking number');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error || 'Order not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <div className="flex space-x-4">
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(e.target.value)}
            disabled={updating}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-sm font-medium text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-sm font-medium text-gray-900">
                ${(order.amount / 100).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.status === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'shipped'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{order.customerEmail}</p>
            </div>
            {order.shippingAddress && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{order.shippingAddress.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Tracking Number</p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={order.trackingNumber || ''}
                  onChange={(e) => updateTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    // Implement tracking number update
                  }}
                  disabled={updating}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
          <textarea
            value={order.notes || ''}
            onChange={(e) => {
              // Implement notes update
            }}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add notes about this order..."
          />
        </div>
      </div>
    </div>
  );
} 