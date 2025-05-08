"use client";

// Payment form logic
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { useOrders, Order } from "../context/OrderContext";
import { postOrder } from "../api/Orders/ordersAPI";
import { trackPayment, trackEvent } from "../utils/analytics";

interface CartItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutForm() {
  // Get Stripe hooks and cart context
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };

  const createOrder = async (items: CartItem[]) => {
    try {
      console.log("CheckoutForm: Creating order with cart items:", items);

      // Get current time for order placed
      const orderTime = new Date();

      // Calculate estimated delivery (30 minutes from now)
      const estimatedDelivery = new Date(orderTime.getTime() + 30 * 60000);

      const order: Order = {
        orderId: `#${Math.floor(Math.random() * 100000)}`,
        estimatedDelivery: formatTime(estimatedDelivery),
        orderPlaced: formatTime(orderTime),
        status: "confirmed",
        items: items.map((item) => ({
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        deliveryFee: 3.0,
        total:
          items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
          3.0,
      };
      console.log("CheckoutForm: Created order object:", order);
      await addOrder(order);
      console.log("CheckoutForm: Order added to context");
      return order;
    } catch (error) {
      console.error("CheckoutForm: Error creating order:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify that Stripe is loaded
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);
    let order: Order | undefined;

    try {
      // First create the order
      //console.log("Creating order before payment...");
      const order = await createOrder(cartItems);
      //onsole.log(order);
      //console.log("Order created successfully:", order);

      //console.log("Cart cleared before payment confirmation");

      // Then process the payment
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "An error occurred");
        setProcessing(false);
        return;
      }

      console.log("Submit Error:", submitError);

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            //return_url: `${window.location.origin}/order-success?order_id=${order.orderId}`,
          },
          redirect: "if_required",
        });

      if (confirmError) {
        setError(confirmError.message || "An error occurred");
        setProcessing(false);
      }
      // Wait for sucessful paymentIntent before redirecting
      //Insert into our own DB
      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Track successful payment
        trackPayment(
          paymentIntent.id,
          order.total,
          'USD',
          cartItems.map(item => ({
            item_id: item.name,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        );

        // Track order completion
        trackEvent('order_complete', {
          order_id: order.orderId,
          total_value: order.total,
          item_count: cartItems.length,
          payment_method: 'stripe'
        });

        // Wait for successful paymentIntent before redirecting
        await postOrder(cartItems, order.total);

        //Get search params needed for order-sucess
        const redirectUrl = new URL(`${window.location.origin}/order-success`);
        redirectUrl.searchParams.set("order_id", order.orderId);
        redirectUrl.searchParams.set("payment_intent", paymentIntent.id);
        redirectUrl.searchParams.set(
          "payment_intent_client_secret",
          paymentIntent.client_secret || ""
        );
        redirectUrl.searchParams.set("redirect_status", paymentIntent.status);

        //Redirect
        router.push(redirectUrl.toString());
      }
    } catch (err) {
      // Track payment error
      trackEvent('payment_error', {
        error_message: err instanceof Error ? err.message : 'Unknown error',
        order_id: order?.orderId
      });
      
      setError("An unexpected error occurred");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe's payment form */}
      <PaymentElement />

      {/* Show any errors */}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-[#0069a7] text-white py-3 rounded hover:bg-[#005286] transition-colors ${
          !stripe || processing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
