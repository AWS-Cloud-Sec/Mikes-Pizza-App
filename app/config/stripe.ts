import { loadStripe } from "@stripe/stripe-js";

// Validate publishable key
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

// Initialize Stripe on the client side
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Create payment request instance
export const createPaymentRequest = (amount: number) => {
  return {
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Total',
      amount: Math.round(amount * 100), // Convert to cents
    },
    requestPayerName: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
  };
};

// Proceed to Checkout to for payment
export const createPaymentIntent = async (amount: number) => {
  try {
    // Validate amount
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount provided');
    }

    console.log("Creating payment intent with amount:", amount);

    // Send the order amount to our Stripe server
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mikes-Pizzas-App",
      },
      body: JSON.stringify({ amount }),
    });

    // Parse response
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid response from server');
    }

    // Handle error response
    if (!response.ok) {
      console.error('Payment intent creation failed:', {
        status: response.status,
        error: data.error,
        details: data.details
      });
      throw new Error(data.error || `Payment failed (${response.status})`);
    }

    // Return client secret
    if (!data.clientSecret) {
      throw new Error('No client secret in response');
    }

    return data.clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
