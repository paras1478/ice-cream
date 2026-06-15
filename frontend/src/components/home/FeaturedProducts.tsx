"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/types";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products/featured?limit=8");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-primary font-semibold text-sm mb-2">
              🌟 Our Bestsellers
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-text">
              Featured <span className="text-primary">Flavors</span>
            </h2>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex group">
            <Link href="/products?isFeatured=true">
              View All
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/products">View All Flavors</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
