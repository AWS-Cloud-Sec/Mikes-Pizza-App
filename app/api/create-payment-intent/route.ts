// Handles payment processing on the server
import { NextResponse } from "next/server";
import Stripe from "stripe";

console.log(process.env.STRIPE_SECRET_KEY);
// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

// Requests a payment intent
export async function POST(request: Request) {
  try {
    // Log environment check 
    console.log("Environment check:", {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY?.length,
      stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 3)
    });

    // Get the order amount
    const { amount } = await request.json();
    console.log("Received amount:", amount);

    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // Create a payment intent, and prepare for payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log("Payment intent created successfully:", {
      id: paymentIntent.id,
      status: paymentIntent.status
    });

    // Send the secure payment secret code to frontend to start payment
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Detailed error creating payment intent:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      stripeError: error instanceof Stripe.errors.StripeError ? {
        type: error.type,
        code: error.code,
        param: error.param,
        message: error.message
      } : undefined
    });

    return NextResponse.json(
      { 
        error: "Error creating payment intent", 
        details: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Stripe.errors.StripeError ? error.type : undefined
      },
      { status: 500 }
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
