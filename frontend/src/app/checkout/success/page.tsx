"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setOrder(d.data);
        });
    }
  }, [orderId]);

  return (
    <>
      <Header onMenuOpen={() => {}} />
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-dark-bg dark:to-dark-card pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6"
            >
              <CheckCircle className="h-12 w-12 text-green-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-3">
                Order Placed! 🍦
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Thank you for your order! We're preparing your ice cream with
                love. You'll receive a confirmation email shortly.
              </p>
            </motion.div>

            {/* Order Details */}
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 text-left mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-primary" />
                  <h2 className="font-bold text-gray-900 dark:text-dark-text">
                    Order Details
                  </h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Order Number</span>
                    <span className="font-semibold text-primary">
                      #{order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Items</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {order.items.length} item(s)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total</span>
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className="font-semibold text-green-600 capitalize">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button asChild className="flex-1 group">
                <Link href="/profile/orders">
                  <Package className="mr-2 h-4 w-4" />
                  Track Order
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>

            {/* Floating Ice Creams */}
            <div className="mt-12 flex justify-center gap-4">
              {["🍦", "🍨", "🍧"].map((emoji, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                  className="text-4xl"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
