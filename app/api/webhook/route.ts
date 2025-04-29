import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Stripe CLI webhook secret for testing your endpoint
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !endpointSecret) {
    return NextResponse.json(
      { error: 'Missing stripe signature or webhook secret' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    // Payment Events
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;

    case 'payment_intent.canceled':
      const canceledPayment = event.data.object;
      console.log('Payment was canceled:', canceledPayment.id);
      break;

    // Customer Events
    case 'customer.created':
      const newCustomer = event.data.object;
      console.log('New customer created:', newCustomer.id);
      break;

    case 'customer.updated':
      const updatedCustomer = event.data.object;
      console.log('Customer updated:', updatedCustomer.id);
      break;

    case 'customer.deleted':
      const deletedCustomer = event.data.object;
      console.log('Customer deleted:', deletedCustomer.id);
      break;

    // Payment Method Events
    case 'payment_method.attached':
      const attachedMethod = event.data.object;
      console.log('Payment method attached:', attachedMethod.id);
      break;

    case 'payment_method.detached':
      const detachedMethod = event.data.object;
      console.log('Payment method detached:', detachedMethod.id);
      break;

    // Refund Events
    case 'charge.refunded':
      const refundedCharge = event.data.object;
      console.log('Charge refunded:', refundedCharge.id);
      break;

    case 'charge.refund.updated':
      const updatedRefund = event.data.object;
      console.log('Refund status updated:', updatedRefund.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
} 