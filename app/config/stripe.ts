import { loadStripe } from "@stripe/stripe-js";
import { fetchAuthSession } from "@aws-amplify/auth";
// Initialize Stripe with  public key
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Proceed to Checkout to for payment
export const createPaymentIntent = async (amount: number) => {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  console.log(idToken);
  try {
    // Send the order amount to our Stripe server
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}create-payment-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ amount }),
      }
    );

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
