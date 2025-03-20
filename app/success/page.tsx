'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (!orderId) {
      setError('No order ID found');
      setLoading(false);
      return;
    }

    // Fetch order details from your backend
    fetch(`/api/orders/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrderDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thank you for your purchase!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your order has been successfully processed.
          </p>
        </div>

        {orderDetails && (
          <div className="mt-8 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Order Details
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Order ID: {orderDetails.id}
                </p>
                <p className="text-sm text-gray-600">
                  Amount: ${(orderDetails.amount / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {orderDetails.status}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
} 