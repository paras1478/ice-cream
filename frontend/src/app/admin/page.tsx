"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { formatPrice } from "@/lib/utils";
import type { DashboardStats, SalesDataPoint, Order } from "@/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes, ordersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/revenue"),
          fetch("/api/orders?limit=5&sort=-createdAt"),
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.data);
        }
        if (revenueRes.ok) {
          const data = await revenueRes.json();
          setSalesData(data.data || []);
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setRecentOrders(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = stats
    ? [
        {
          title: "Today's Revenue",
          value: formatPrice(stats.todayRevenue),
          icon: <DollarSign className="h-6 w-6" />,
          change: 12.5,
          color: "pink" as const,
        },
        {
          title: "Total Orders",
          value: stats.totalOrders.toLocaleString(),
          icon: <ShoppingBag className="h-6 w-6" />,
          change: 8.2,
          color: "teal" as const,
        },
        {
          title: "Total Products",
          value: stats.totalProducts.toLocaleString(),
          icon: <Package className="h-6 w-6" />,
          color: "yellow" as const,
        },
        {
          title: "Total Customers",
          value: stats.totalCustomers.toLocaleString(),
          icon: <Users className="h-6 w-6" />,
          change: 5.1,
          color: "purple" as const,
        },
      ]
    : [];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-dark-border rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCards.map((card, index) => (
              <StatsCard key={index} {...card} index={index} />
            ))}
          </div>
        )}

        {/* Alerts */}
        {stats && (stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
          <div className="flex flex-wrap gap-3">
            {stats.pendingOrders > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2.5 text-sm"
              >
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  {stats.pendingOrders} pending orders need attention
                </span>
              </motion.div>
            )}
            {stats.lowStockProducts > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5 text-sm"
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-medium text-red-700 dark:text-red-400">
                  {stats.lowStockProducts} products are low on stock
                </span>
              </motion.div>
            )}
          </div>
        )}

        {/* Sales Chart */}
        {salesData.length > 0 && (
          <SalesChart data={salesData} title="Sales Overview (Last 30 Days)" />
        )}

        {/* Recent Orders */}
        <RecentOrders orders={recentOrders} />
      </div>
    </>
  );
}
