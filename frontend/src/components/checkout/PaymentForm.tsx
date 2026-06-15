"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { Shield, Lock } from "lucide-react";

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  amount: number;
}

export function PaymentForm({
  clientSecret,
  onSuccess,
  onError,
  amount,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      onError(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 dark:border-dark-border rounded-xl p-4 bg-white dark:bg-dark-bg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#374151",
                  fontFamily: "Inter, sans-serif",
                  "::placeholder": {
                    color: "#9CA3AF",
                  },
                },
                invalid: {
                  color: "#EF4444",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Security */}
      <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 dark:bg-dark-border rounded-lg px-3 py-2">
        <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
        <span>Your payment information is encrypted and secure</span>
        <Lock className="h-3.5 w-3.5 flex-shrink-0" />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        loading={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing
          ? "Processing..."
          : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>
    </form>
  );
}
