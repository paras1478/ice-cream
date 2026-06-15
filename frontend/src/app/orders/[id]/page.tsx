"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

const statusSteps = [
  { id: "pending", label: "Order Placed", icon: Clock },
  { id: "processing", label: "Processing", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle },
];

const statusOrder = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header onMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="min-h-screen pt-20 container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-dark-border rounded w-1/3" />
            <div className="h-48 bg-gray-200 dark:bg-dark-border rounded-2xl" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header onMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">📦</p>
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
              Order not found
            </h2>
            <Link href="/profile/orders" className="text-primary hover:underline mt-2 inline-block">
              Back to Orders
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Back */}
          <Link
            href="/profile/orders"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge
              variant={
                isCancelled
                  ? "danger"
                  : order.orderStatus === "delivered"
                  ? "success"
                  : "warning"
              }
            >
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </Badge>
          </div>

          {/* Status Tracker */}
          {!isCancelled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 mb-6"
            >
              <h2 className="font-semibold text-gray-900 dark:text-dark-text mb-6">
                Order Status
              </h2>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="flex flex-col items-center flex-1 relative">
                      {index > 0 && (
                        <div
                          className={`absolute top-5 left-0 right-1/2 h-0.5 ${
                            isCompleted ? "bg-primary" : "bg-gray-200 dark:bg-dark-border"
                          }`}
                          style={{ right: "50%", left: "-50%" }}
                        />
                      )}
                      <div
                        className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                          isCompleted
                            ? "bg-primary border-primary text-white"
                            : "bg-white dark:bg-dark-bg border-gray-200 dark:border-dark-border text-gray-400"
                        } ${isCurrent ? "shadow-ice ring-4 ring-primary/20" : ""}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p
                        className={`text-xs mt-2 font-medium text-center ${
                          isCompleted ? "text-primary" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Items */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-dark-text mb-4">
              Items Ordered
            </h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-dark-border flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-2xl">🍦</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-dark-text">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>
                  {order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 dark:text-dark-text pt-2 border-t border-gray-100 dark:border-dark-border">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                  Shipping Address
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
                <span className="block font-medium text-gray-800 dark:text-gray-200">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </span>
                <span className="block">{order.shippingAddress.street}</span>
                <span className="block">
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </span>
                <span className="block">{order.shippingAddress.country}</span>
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                  Payment Info
                </h3>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium capitalize">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span
                    className={`font-medium capitalize ${
                      order.paymentStatus === "paid"
                        ? "text-green-600"
                        : "text-amber-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
