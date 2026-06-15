"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDateShort } from "@/lib/utils";
import type { Order } from "@/types";

interface RecentOrdersProps {
  orders: Order[];
}

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

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
        <h3 className="font-semibold text-gray-900 dark:text-dark-text">
          Recent Orders
        </h3>
        <Link
          href="/admin/orders"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-dark-border">
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                Order
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                Customer
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                Date
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                Status
              </th>
              <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = statusConfig[order.orderStatus];
                const customer =
                  typeof order.user === "object" ? order.user : null;

                return (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {customer?.name || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateShort(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                        {formatPrice(order.total)}
                      </p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
