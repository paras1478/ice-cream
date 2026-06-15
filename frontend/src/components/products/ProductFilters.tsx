"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types";

interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  flavor: string;
}

const sortOptions = [
  { value: "-createdAt", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-rating", label: "Highest Rated" },
  { value: "-reviewCount", label: "Most Reviewed" },
];

const flavorOptions = [
  "Strawberry", "Chocolate", "Vanilla", "Mint", "Mango", "Blueberry",
  "Pistachio", "Caramel", "Lemon", "Mixed Berry", "Coconut", "Coffee",
];

interface CollapsibleSection {
  isOpen: boolean;
  toggle: () => void;
  title: string;
  children: React.ReactNode;
}

function CollapsibleSection({ isOpen, toggle, title, children }: CollapsibleSection) {
  return (
    <div className="border-b border-gray-100 dark:border-dark-border pb-4 mb-4 last:border-0">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 dark:text-dark-text mb-3"
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && children}
    </div>
  );
}

interface ProductFiltersProps {
  className?: string;
}

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    flavor: true,
    sort: true,
  });

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "-createdAt",
    flavor: searchParams.get("flavor") || "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []));
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.flavor) params.set("flavor", filters.flavor);
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "-createdAt",
      flavor: "",
    });
    const search = searchParams.get("search");
    router.push(search ? `/products?search=${search}` : "/products");
  };

  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice || filters.flavor;

  return (
    <div
      className={`bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="font-semibold text-gray-900 dark:text-dark-text">
            Filters
          </span>
          {hasActiveFilters && (
            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-white text-xs">
              !
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Sort */}
      <CollapsibleSection
        isOpen={openSections.sort}
        toggle={() => toggleSection("sort")}
        title="Sort By"
      >
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={filters.sort === option.value}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="accent-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Category */}
      <CollapsibleSection
        isOpen={openSections.category}
        toggle={() => toggleSection("category")}
        title="Category"
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={!filters.category}
              onChange={() => setFilters({ ...filters, category: "" })}
              className="accent-primary"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={filters.category === cat.slug}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="accent-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {cat.name}
                <span className="text-gray-400 ml-1 text-xs">({cat.productCount})</span>
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Price Range */}
      <CollapsibleSection
        isOpen={openSections.price}
        toggle={() => toggleSection("price")}
        title="Price Range"
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="w-full rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="w-full rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </CollapsibleSection>

      {/* Flavor */}
      <CollapsibleSection
        isOpen={openSections.flavor}
        toggle={() => toggleSection("flavor")}
        title="Flavor"
      >
        <div className="flex flex-wrap gap-2">
          {flavorOptions.map((flavor) => (
            <button
              key={flavor}
              onClick={() =>
                setFilters({
                  ...filters,
                  flavor: filters.flavor === flavor ? "" : flavor,
                })
              }
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filters.flavor === flavor
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary dark:bg-dark-border dark:text-gray-400"
              }`}
            >
              {flavor}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <Button className="w-full" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
