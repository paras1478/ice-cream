"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  color?: "pink" | "teal" | "yellow" | "purple";
  index?: number;
}

const colorClasses = {
  pink: "from-primary/20 to-pink-100 text-primary dark:from-primary/10 dark:to-pink-900/10",
  teal: "from-secondary/20 to-teal-100 text-secondary dark:from-secondary/10 dark:to-teal-900/10",
  yellow: "from-accent/20 to-yellow-100 text-amber-600 dark:from-accent/10 dark:to-yellow-900/10",
  purple: "from-purple-100 to-indigo-100 text-purple-600 dark:from-purple-900/10 dark:to-indigo-900/10",
};

export function StatsCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  color = "pink",
  index = 0,
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
            {value}
          </p>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-xs font-medium",
                isPositive ? "text-green-600" : "text-red-500"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change}% {changeLabel || "vs last period"}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br",
            colorClasses[color]
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
