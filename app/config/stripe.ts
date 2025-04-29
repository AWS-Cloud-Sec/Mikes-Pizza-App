import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with  public key
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

    // Log the configuration check
    console.log("Stripe frontend configuration check:", {
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      amount: amount
    });

    // Send the order amount to our Stripe server
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    // Throw an error if the response is not ok
    if (!response.ok) {
      console.error("Payment intent creation failed:", {
        status: response.status,
        statusText: response.statusText,
        error: data.error,
        details: data.details,
        type: data.type
      });
      throw new Error(data.error || "Failed to create payment intent");
    }

    // Get the payment secret
    return data.clientSecret;
  } catch (error) {
    console.error("Error creating payment intent:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
