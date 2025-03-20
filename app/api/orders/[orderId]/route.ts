import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { sendOrderStatusEmail, sendCreatorOrderNotification } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    
    // First try to get order by ID
    let orderDoc = await getDoc(doc(db, 'orders', orderId));
    
    // If not found, try to get by session ID
    if (!orderDoc.exists()) {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('sessionId', '==', orderId)
      );
      const querySnapshot = await getDocs(ordersQuery);
      if (!querySnapshot.empty) {
        orderDoc = querySnapshot.docs[0];
      }
    }
    
    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();

    return NextResponse.json({
      id: orderDoc.id,
      ...orderData,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    const body = await request.json();
    const { status, trackingNumber, notes } = body;

    // Get current order data
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    const previousStatus = orderData.status;

    // Update order in Firestore
    const orderRef = doc(db, 'orders', orderId);
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (status) updateData.status = status;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;

    await updateDoc(orderRef, updateData);

    // Send email notifications if status has changed
    if (status && status !== previousStatus) {
      // Send to customer
      await sendOrderStatusEmail(
        orderData.customerEmail,
        orderId,
        status,
        orderData.amount,
        trackingNumber
      );

      // Send to creator if it's a new order
      if (status === 'pending' && previousStatus === 'processing') {
        await sendCreatorOrderNotification(
          orderData.creatorEmail,
          orderId,
          orderData.amount,
          orderData.customerEmail
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 