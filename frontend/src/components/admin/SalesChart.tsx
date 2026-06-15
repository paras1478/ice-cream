"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import type { SalesDataPoint } from "@/types";

interface SalesChartProps {
  data: SalesDataPoint[];
  type?: "line" | "bar";
  title?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-dark-text mb-2">
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === "Revenue" ? `$${entry.value.toFixed(2)}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function SalesChart({ data, type = "line", title }: SalesChartProps) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5">
      {title && (
        <h3 className="text-base font-semibold text-gray-900 dark:text-dark-text mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        {type === "line" ? (
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#FF6B9D"
              strokeWidth={2.5}
              dot={{ fill: "#FF6B9D", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#4ECDC4"
              strokeWidth={2.5}
              dot={{ fill: "#4ECDC4", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="#FF6B9D" radius={[6, 6, 0, 0]} />
            <Bar dataKey="orders" name="Orders" fill="#4ECDC4" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
