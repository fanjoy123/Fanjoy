import { NextResponse } from 'next/server';
import { mockData } from '@/lib/mockData';

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
    // Get all orders
    const orders = await mockData.getOrders();

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