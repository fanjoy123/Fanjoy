import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { headers } from 'next/headers';

function generateCSV(orders: any[]) {
  const headers = [
    'Order ID',
    'Date',
    'Customer Email',
    'Amount',
    'Status',
    'Tracking Number',
    'Notes'
  ];

  const rows = orders.map(order => [
    order.id,
    new Date(order.createdAt).toLocaleDateString(),
    order.customerEmail,
    `$${(order.amount / 100).toFixed(2)}`,
    order.status,
    order.trackingNumber || '',
    order.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const creatorId = headersList.get('x-creator-id');

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all orders for the creator
    const ordersQuery = query(
      collection(db, 'orders'),
      where('creatorId', '==', creatorId),
      orderBy('createdAt', 'desc')
    );

    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Generate CSV content
    const csvContent = generateCSV(orders);

    // Create response with CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="fanjoy-orders-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting orders:', error);
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    );
  }
} 