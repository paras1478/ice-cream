"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const sortOptions = [
  { value: "-createdAt", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-rating", label: "Highest Rated" },
  { value: "-reviewCount", label: "Most Popular" },
];

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "-createdAt";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-sm text-gray-700 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
