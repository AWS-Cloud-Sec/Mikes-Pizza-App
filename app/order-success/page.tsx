"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '../components/Footer';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

  useEffect(() => {
    if (!paymentIntent || !paymentIntentClientSecret) {
      router.push('/');
    }
  }, [paymentIntent, paymentIntentClientSecret, router]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your payment has been processed successfully.
          </p>
          <div className="space-x-4">
            <Link
              href="/"
              className="bg-[#0069a7] text-white px-6 py-3 rounded hover:bg-[#005286] transition-colors"
            >
              Return Home
            </Link>
            <Link
              href="/track-order"
              className="bg-white text-[#0069a7] px-6 py-3 rounded border border-[#0069a7] hover:bg-gray-50 transition-colors"
            >
              View Order
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0069a7]"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
} 