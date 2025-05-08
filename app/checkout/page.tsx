"use client";

export const dynamic = 'force-dynamic';

// Checkout process
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { stripePromise, createPaymentIntent } from "../config/stripe";
import CheckoutForm from "../components/CheckoutForm";
import Footer from "../components/Footer";
import { postOrder } from "../api/Orders/ordersAPI";

export default function CheckoutPage() {
  // Get cart items
  const { cartItems } = useCart();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If cart is empty, go back to cart page
    if (cartItems.length === 0) {
      router.push("/cart");
      return;
    }

    // Calculate the total order amount
    const calculateTotal = () => {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const deliveryFee = 5.0;
      const tax = subtotal * 0.08;
      return subtotal + deliveryFee + tax;
    };

    // Set up payment
    const initializePayment = async () => {
      try {
        const total = calculateTotal();
        const secret = await createPaymentIntent(total);
        setClientSecret(secret);
      } catch (error) {
        console.error("Error initializing payment:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [cartItems, router]);

  // Display loading spinner while setting up payment
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0069a7] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  // Show error if payment setup failed
  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">
            Error loading payment information. Please try again.
          </p>
          <button
            onClick={() => router.push("/cart")}
            className="mt-4 bg-[#0069a7] text-white px-4 py-2 rounded hover:bg-[#005286]"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  // Show the checkout form and order summary
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment form section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
          </div>

          {/* Order summary section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    $
                    {cartItems
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>
                    $
                    {(
                      cartItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      ) * 0.08
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>
                    $
                    {(
                      cartItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      ) +
                      5 +
                      cartItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      ) *
                        0.08
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
