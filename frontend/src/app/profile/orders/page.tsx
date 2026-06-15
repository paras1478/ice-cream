"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Badge } from "@/components/ui/Badge";
import { OrderSkeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "secondary" | "default" }
> = {
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <Package className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
              My Orders
            </h1>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Your order history will appear here once you place an order.
              </p>
              <Link
                href="/products"
                className="text-primary hover:underline font-medium"
              >
                Start Shopping →
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const status = statusConfig[order.orderStatus];
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-primary">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>

                    {/* Items Preview */}
                    <div className="flex items-center gap-2 mb-4">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div
                          key={i}
                          className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-50 dark:bg-dark-border flex-shrink-0"
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-xl">
                              🍦
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-dark-border flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                          +{order.items.length - 3}
                        </div>
                      )}
                      <div className="ml-auto text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} item(s)
                        </p>
                        <p className="font-bold text-lg text-gray-900 dark:text-dark-text">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Payment:{" "}
                        <span className="capitalize font-medium text-gray-700 dark:text-gray-300">
                          {order.paymentStatus}
                        </span>
                      </p>
                      <Link
                        href={`/orders/${order._id}`}
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-600"
                      >
                        View Details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
