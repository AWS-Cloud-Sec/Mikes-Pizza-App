import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with public key
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Proceed to Checkout to for payment
export const createPaymentIntent = async (amount: number) => {
  try {
    if (!amount || isNaN(amount)) {
      throw new Error("Invalid amount provided");
    }

    console.log("Creating payment intent with amount:", amount);

    // Send the order amount to our Stripe server
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      console.error("Failed to parse error response:", e);
      errorData = {};
    }

    if (!response.ok) {
      console.error("Payment intent creation failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData.error,
        details: errorData.details,
        type: errorData.type
      });
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return errorData.clientSecret;
  } catch (error) {
    console.error("Error creating payment intent:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
