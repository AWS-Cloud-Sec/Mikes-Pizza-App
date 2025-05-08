"use client";

import { useEffect, Suspense, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "../components/Footer";
import { useOrders } from "../context/OrderContext";
import { useCart } from "../context/CartContext";


function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  const paymentIntentClientSecret = searchParams.get(
    "payment_intent_client_secret"
  );
  const orderId = searchParams.get("order_id");
  const { orders } = useOrders();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const hasCleared = useRef(false);

  //Had toredouse effect as I need to insert into our db before you wipe the cart
  useEffect(() => {
    const verifyOrder = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!paymentIntent || !paymentIntentClientSecret) {
          console.log("Missing payment parameters");
          router.push("/");
          return;
        }

        const orderExists = orders.some((order) => order.orderId === orderId);
        if (!orderExists) {
          console.error("Order not found:", orderId);
          console.log("Current orders:", orders);
          setIsLoading(false);
          return;
        }

        if (!hasCleared.current) {
          clearCart();
          hasCleared.current = true;
          console.log("Cart cleared on order success page");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error verifying order:", error);
        setIsLoading(false);
      }
    };

    verifyOrder();
  }, [
    paymentIntent,
    paymentIntentClientSecret,
    orderId,
    orders,
    router,
    clearCart,
  ]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0069a7]"></div>
      </div>
    );
  }

  if (orderId && !orders.some((order) => order.orderId === orderId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Order Verification Failed</h1>
          <p className="text-gray-600 mb-8">
            We couldn't find your order. Please contact support if this issue
            persists.
          </p>
          <div className="space-x-4">
            <Link
              href="/"
              className="bg-[#0069a7] text-white px-6 py-3 rounded hover:bg-[#005286] transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16 w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Thank you for your order. Your payment has been processed
              successfully.
            </p>
            <div className="space-x-4">
              <Link
                href="/track-order"
                className="bg-[#0069a7] text-white px-8 py-3 rounded-lg hover:bg-[#005286] transition-colors inline-block"
              >
                Track Your Order
              </Link>
              <Link
                href="/"
                className="bg-white text-[#0069a7] px-8 py-3 rounded-lg border border-[#0069a7] hover:bg-gray-50 transition-colors inline-block"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0069a7]"></div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
