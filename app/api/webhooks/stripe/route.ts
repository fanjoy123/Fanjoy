import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { mockData } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { customerEmail, productId, creatorId } = session.metadata || {};

        if (!customerEmail || !productId || !creatorId) {
          throw new Error('Missing required metadata');
        }

        // Record the order in mock data
        await mockData.createOrder({
          id: session.id,
          orderId: session.id,
          customerEmail,
          productId,
          creatorId,
          amount: session.amount_total,
          status: 'pending',
        });

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        if (!orderId) {
          throw new Error('Missing order ID in metadata');
        }

        // Update order status
        await mockData.updateOrder(orderId, {
          status: 'processing',
        });

        break;
      }

      case 'payout.paid': {
        const payout = event.data.object;
        const creatorId = payout.metadata?.creatorId;

        if (!creatorId) {
          throw new Error('Missing creator ID in metadata');
        }

        // Update payout status in mock data
        await mockData.updateOrder(payout.id, {
          status: 'completed',
          completedAt: new Date().toISOString(),
          transactionId: payout.id,
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 