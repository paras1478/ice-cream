"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCart } from "@/hooks/useCart";
import type { CheckoutFormData } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    subtotal,
    discount,
    tax,
    shippingFee,
    total,
    couponCode,
    clearCart,
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (items.length === 0) {
    return (
      <>
        <Header onMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🛒</p>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
              Your cart is empty
            </h2>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleCheckout = async (formData: CheckoutFormData) => {
    if (!session) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
          image: item.product.images?.[0] || "",
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        couponCode: couponCode || undefined,
        notes: formData.notes,
        subtotal,
        discount,
        tax,
        shippingFee,
        total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        if (formData.paymentMethod === "stripe") {
          // Create Stripe payment intent
          const stripeRes = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.data._id,
              amount: Math.round(total * 100),
            }),
          });

          const stripeData = await stripeRes.json();

          if (stripeRes.ok && stripeData.url) {
            window.location.href = stripeData.url;
            return;
          }
        }

        clearCart();
        toast.success("Order placed successfully! 🍦");
        router.push(`/checkout/success?orderId=${data.data._id}`);
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />

      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Lock className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
              Secure Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6">
              <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />
            </div>

            {/* Order Summary */}
            <div>
              <OrderSummary
                items={items}
                subtotal={subtotal}
                discount={discount}
                tax={tax}
                shippingFee={shippingFee}
                total={total}
                couponCode={couponCode}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
