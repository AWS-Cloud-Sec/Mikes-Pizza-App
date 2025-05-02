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

    try {
      // First create the order
      console.log("Creating order before payment...");
      const order = await createOrder(cartItems);
      console.log("Order created successfully:", order);
      //Hello Haoo, gunnna insert my lambda function herre, dont mind meeeeeeeeee
      const lambdaOrder = await postOrder(cartItems, order.total);
      console.log(lambdaOrder);

      // Clear cart before payment confirmation
      clearCart();
      console.log("Cart cleared before payment confirmation");

      // Then process the payment
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "An error occurred");
        setProcessing(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success?order_id=${order.orderId}`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || "An error occurred");
        setProcessing(false);
      }
    } catch (err) {
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
