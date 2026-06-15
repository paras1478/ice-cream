"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCcw } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDateShort } from "@/lib/utils";
import type { Order } from "@/types";
import toast from "react-hot-toast";

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

const allStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders?limit=50&sort=-createdAt&admin=1");
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

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: status as Order["orderStatus"] } : o
          )
        );
        toast.success("Order status updated!");
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((order) => {
    const matchesSearch =
      !search ||
      order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      (typeof order.user === "object" &&
        order.user.name?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <AdminHeader title="Orders" />
      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders or customers..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full dark:text-dark-text"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-dark-text"
          >
            <option value="">All Statuses</option>
            {allStatuses.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    {["Order", "Customer", "Date", "Items", "Total", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => {
                      const status = statusConfig[order.orderStatus];
                      const customer =
                        typeof order.user === "object" ? order.user : null;

                      return (
                        <tr
                          key={order._id}
                          className="border-b border-gray-50 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-primary">
                            #{order.orderNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                            {customer?.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {formatDateShort(order.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {order.items.length} item(s)
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {formatPrice(order.total)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              disabled={updating === order._id}
                              className="rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:text-dark-text disabled:opacity-50"
                            >
                              {allStatuses.map((s) => (
                                <option key={s} value={s} className="capitalize">
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
