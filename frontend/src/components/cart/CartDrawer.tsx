"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    discount,
    tax,
    shippingFee,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.toUpperCase(), orderAmount: subtotal }),
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
      setValidatingCoupon(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-dark-card shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text">
                  Shopping Cart
                </h2>
                {items.length > 0 && (
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors dark:hover:bg-dark-border"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-6"
                >
                  🍦
                </motion.div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Your cart is empty!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  Looks like you haven't added any ice cream yet.
                </p>
                <Button onClick={closeCart} asChild>
                  <Link href="/products">Browse Ice Creams</Link>
                </Button>
              </motion.div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <CartItem key={item.product._id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 dark:border-dark-border p-5 space-y-4">
                  {/* Coupon */}
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                          {couponCode} applied!
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        className="text-sm uppercase"
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApplyCoupon}
                        loading={validatingCoupon}
                        className="whitespace-nowrap"
                      >
                        Apply
                      </Button>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Tax (8%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(shippingFee)
                        )}
                      </span>
                    </div>
                    {shippingFee > 0 && (
                      <p className="text-xs text-gray-400">
                        Free shipping on orders over $50
                      </p>
                    )}
                    <div className="flex justify-between text-base font-bold text-gray-900 dark:text-dark-text pt-2 border-t border-gray-100 dark:border-dark-border">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button className="w-full group" size="lg" asChild>
                    <Link href="/checkout" onClick={closeCart}>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full text-sm" asChild>
                    <Link href="/cart" onClick={closeCart}>
                      View Full Cart
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
