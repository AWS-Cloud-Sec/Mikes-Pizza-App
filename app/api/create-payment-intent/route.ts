// Handles payment processing on the server
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Validate Stripe key
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not defined in environment variables');
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

// Requests a payment intent
export async function POST(request: Request) {
  try {
    // Validate request
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Get the order amount
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { amount } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('PaymentIntent created successfully:', paymentIntent.id);

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { 
        error: 'Error creating payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// Added handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
