import Stripe from 'stripe';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export interface CreateCheckoutSessionParams {
  productId: string;
  quantity: number;
  customerEmail: string;
  creatorId: string;
}

export interface CreatePayoutParams {
  creatorId: string;
  amount: number;
}

export async function createCheckoutSession({
  productId,
  quantity,
  customerEmail,
  creatorId,
}: CreateCheckoutSessionParams) {
  try {
    // Get the product details from Printify
    const productDoc = await getDoc(doc(db, 'products', productId));
    const product = productDoc.data();

    if (!product) {
      throw new Error('Product not found');
    }

    // Get the creator's Stripe account ID
    const creatorDoc = await getDoc(doc(db, 'users', creatorId));
    const creator = creatorDoc.data();

    if (!creator?.stripeAccountId) {
      throw new Error('Creator has not connected their Stripe account');
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.description,
            },
            unit_amount: product.price * 100, // Convert to cents
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      customer_email: customerEmail,
      metadata: {
        productId,
        creatorId,
      },
      payment_intent_data: {
        transfer_data: {
          destination: creator.stripeAccountId,
          amount: Math.round(product.price * quantity * 100 * 0.8), // 80% goes to creator
        },
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function createPayout({ creatorId, amount }: CreatePayoutParams) {
  try {
    // Get the creator's Stripe account ID
    const creatorDoc = await getDoc(doc(db, 'users', creatorId));
    const creator = creatorDoc.data();

    if (!creator?.stripeAccountId) {
      throw new Error('Creator has not connected their Stripe account');
    }

    // Create a transfer to the creator's connected account
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      destination: creator.stripeAccountId,
    });

    // Record the payout in Firestore
    await addDoc(collection(db, 'payouts'), {
      creatorId,
      amount,
      stripeTransferId: transfer.id,
      status: 'completed',
      createdAt: new Date().toISOString(),
    });

    return transfer;
  } catch (error) {
    console.error('Error creating payout:', error);
    throw error;
  }
}

export async function handleWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update order status in Firestore
        await setDoc(doc(db, 'orders', session.id), {
          status: 'completed',
          customerEmail: session.customer_email,
          productId: session.metadata?.productId,
          creatorId: session.metadata?.creatorId,
          amount: session.amount_total,
          createdAt: new Date().toISOString(),
        });

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status in Firestore
        await updateDoc(doc(db, 'orders', paymentIntent.id), {
          paymentStatus: 'succeeded',
          updatedAt: new Date().toISOString(),
        });

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status in Firestore
        await updateDoc(doc(db, 'orders', paymentIntent.id), {
          paymentStatus: 'failed',
          updatedAt: new Date().toISOString(),
        });

        break;
      }
    }

    return { received: true };
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
} 