"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const {
    items,
    subtotal,
    discount,
    tax,
    shippingFee,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [validating, setValidating] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    setValidating(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponInput.toUpperCase(),
          orderAmount: subtotal,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const discountAmount =
          data.coupon.type === "percentage"
            ? (subtotal * data.coupon.value) / 100
            : data.coupon.value;
        applyCoupon(couponInput.toUpperCase(), discountAmount);
        setCouponInput("");
        toast.success(`Coupon applied! You saved ${formatPrice(discountAmount)}`);
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setValidating(false);
    }
  };

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-8 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            Shopping Cart
            {items.length > 0 && (
              <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                ({items.length} items)
              </span>
            )}
          </h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🍦
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                Your cart is empty!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                Looks like you haven't added any ice cream yet. Let's fix that!
              </p>
              <Button size="lg" asChild>
                <Link href="/products">
                  Browse Ice Creams
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Clear Cart */}
                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear Cart
                  </button>
                </div>

                <AnimatePresence>
                  {items.map((item) => (
                    <div
                      key={item.product._id}
                      className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-4"
                    >
                      <CartItem item={item} />
                    </div>
                  ))}
                </AnimatePresence>

                {/* Coupon */}
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-3">
                    Coupon Code
                  </h3>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">
                          ✓ Coupon applied: {couponCode}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          You saved {formatPrice(discount)}!
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Input
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        className="text-sm uppercase"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleApplyCoupon()
                        }
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        loading={validating}
                        className="whitespace-nowrap"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {/* Continue Shopping */}
                <Button variant="ghost" asChild className="gap-2">
                  <Link href="/products">← Continue Shopping</Link>
                </Button>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <CartSummary
                  subtotal={subtotal}
                  discount={discount}
                  tax={tax}
                  shippingFee={shippingFee}
                  total={total}
                  couponCode={couponCode}
                />
                <Button className="w-full group" size="lg" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
