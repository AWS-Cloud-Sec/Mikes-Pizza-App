"use client";

// Payment form logic
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, PaymentElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { createPaymentRequest } from '../config/stripe';

interface CheckoutFormProps {
  clientSecret: string;
}

export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  // Get Stripe hooks and cart context
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart, cartItems } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  // Calculate total amount
  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00;
    const tax = subtotal * 0.08;
    return subtotal + deliveryFee + tax;
  };

  useEffect(() => {
    if (!stripe || !elements) return;

    const pr = stripe.paymentRequest(createPaymentRequest(calculateTotal()));

    // Check if the Payment Request API is available
    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr);
        setCanMakePayment(true);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      setProcessing(true);
      setError(null);

      try {
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (confirmError) {
          ev.complete('fail');
          setError(confirmError.message || 'Payment failed');
          setProcessing(false);
          return;
        }

        ev.complete('success');

        if (paymentIntent.status === 'requires_action') {
          const { error } = await stripe.confirmCardPayment(clientSecret);
          if (error) {
            setError(error.message || 'Payment failed');
            setProcessing(false);
            return;
          }
        }

        // Payment successful
        clearCart();
        router.push('/order-success');
      } catch (err) {
        setError('An unexpected error occurred');
        setProcessing(false);
      }
    });
  }, [stripe, elements, cartItems, clientSecret]);

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
      // Submit the payment form to Stripe
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'An error occurred');
        setProcessing(false);
        return;
      }

      // Confirm the payment with Stripe
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'An error occurred');
        setProcessing(false);
      } else {
        // Clear cart after successful payment
        clearCart();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {canMakePayment && (
        <div className="mb-6">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  theme: 'dark',
                  height: '48px',
                },
              },
            }}
          />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or pay with card</span>
            </div>
          </div>
        </div>
      )}

      <PaymentElement />
      
      {/* Show any errors */}
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-[#0069a7] text-white py-3 rounded hover:bg-[#005286] transition-colors ${
          (!stripe || processing) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
} 