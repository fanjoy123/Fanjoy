import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { sendPayoutNotification, sendCreatorOrderNotification } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { customerEmail, productId, creatorId } = session.metadata || {};

      if (!customerEmail || !productId || !creatorId) {
        throw new Error('Missing required metadata');
      }

      // Get product details
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }

      // Get creator's Stripe account ID
      const creatorDoc = await getDoc(doc(db, 'users', creatorId));
      if (!creatorDoc.exists()) {
        throw new Error('Creator not found');
      }

      const creatorData = creatorDoc.data();
      const stripeAccountId = creatorData.stripeAccountId;

      // Record the order in Firestore
      await setDoc(doc(db, 'orders', session.id), {
        id: session.id,
        sessionId: session.id,
        customerEmail,
        productId,
        creatorId,
        amount: session.amount_total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Send email notifications
      await sendCreatorOrderNotification(
        creatorData.email,
        session.id,
        session.amount_total!,
        customerEmail
      );

      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (!orderId) {
        throw new Error('Missing order ID in metadata');
      }

      // Update order status
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'processing',
        updatedAt: new Date().toISOString(),
      });

      break;
    }

    case 'payout.paid': {
      const payout = event.data.object as Stripe.Payout;
      const creatorId = payout.metadata?.creatorId;

      if (!creatorId) {
        throw new Error('Missing creator ID in metadata');
      }

      // Get creator's email
      const creatorDoc = await getDoc(doc(db, 'users', creatorId));
      if (!creatorDoc.exists()) {
        throw new Error('Creator not found');
      }

      const creatorData = creatorDoc.data();

      // Update payout status in Firestore
      await updateDoc(doc(db, 'payouts', payout.id), {
        status: 'completed',
        completedAt: new Date().toISOString(),
        transactionId: payout.id,
      });

      // Send payout notification
      await sendPayoutNotification(
        creatorData.email,
        payout.amount,
        new Date().toISOString()
      );

      break;
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await handleWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 