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

    // Send the order amount to our Stripe server
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.clientSecret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};
