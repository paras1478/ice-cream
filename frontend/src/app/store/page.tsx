"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product, Category } from "@/types";

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.data || []);
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category?._id === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-teal-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600 text-transparent bg-clip-text">
            Our Store
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our delicious collection of ice cream flavors and treats
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-3xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg focus:border-pink-500 dark:focus:border-pink-500 outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 rounded-2xl border-2 border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg focus:border-pink-500 dark:focus:border-pink-500 outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-12 pr-8 py-3 rounded-2xl border-2 border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg focus:border-pink-500 dark:focus:border-pink-500 outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 dark:bg-dark-border rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No products found matching your criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
