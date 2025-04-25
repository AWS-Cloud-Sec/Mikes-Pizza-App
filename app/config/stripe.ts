import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with  public key
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Proceed to Checkout to for payment
export const createPaymentIntent = async (amount: number) => {
  try {
    // Send the order amount to our Stripe server
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    // Throw an error, if something went wrong with payment
    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    // Get the payment secret
    const data = await response.json();
    return data.clientSecret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};
