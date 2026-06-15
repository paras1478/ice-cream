"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SalesChart } from "@/components/admin/SalesChart";
import { StatsCard } from "@/components/admin/StatsCard";
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { SalesDataPoint, DashboardStats } from "@/types";

export default function AdminReportsPage() {
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/revenue").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ])
      .then(([revData, statsData]) => {
        setSalesData(revData.data || []);
        setStats(statsData.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <>
      <AdminHeader title="Reports & Analytics" />
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Total Revenue (30d)"
            value={loading ? "..." : formatPrice(totalRevenue)}
            icon={<DollarSign className="h-6 w-6" />}
            color="pink"
            index={0}
          />
          <StatsCard
            title="Total Orders (30d)"
            value={loading ? "..." : totalOrders.toString()}
            icon={<ShoppingBag className="h-6 w-6" />}
            color="teal"
            index={1}
          />
          <StatsCard
            title="Avg Order Value"
            value={loading ? "..." : formatPrice(avgOrderValue)}
            icon={<TrendingUp className="h-6 w-6" />}
            color="yellow"
            index={2}
          />
          <StatsCard
            title="Total Customers"
            value={loading ? "..." : (stats?.totalCustomers || 0).toString()}
            icon={<Users className="h-6 w-6" />}
            color="purple"
            index={3}
          />
        </div>

        {/* Revenue Line Chart */}
        {salesData.length > 0 && (
          <SalesChart
            data={salesData}
            type="line"
            title="Revenue Trend (Last 30 Days)"
          />
        )}

        {/* Orders Bar Chart */}
        {salesData.length > 0 && (
          <SalesChart
            data={salesData}
            type="bar"
            title="Orders by Day"
          />
        )}
      </div>
    </>
  );
}
