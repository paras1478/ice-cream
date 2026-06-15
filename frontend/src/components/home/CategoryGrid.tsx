"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Category } from "@/types";

const categoryEmojis: Record<string, string> = {
  classics: "🍦",
  sorbets: "🍧",
  sundaes: "🍨",
  seasonal: "🌸",
  vegan: "🌱",
  premium: "✨",
  novelties: "🍡",
  "sugar-free": "💚",
};

const categoryColors: Record<string, string> = {
  classics: "from-primary/20 to-pink-200",
  sorbets: "from-secondary/20 to-cyan-200",
  sundaes: "from-accent/20 to-yellow-200",
  seasonal: "from-purple-100 to-pink-200",
  vegan: "from-green-100 to-emerald-200",
  premium: "from-amber-100 to-yellow-200",
};

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?limit=8");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-dark-card">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-dark-border rounded-lg animate-pulse mb-8 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-dark-border rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Fallback categories if API returns empty
  const displayCategories =
    categories.length > 0
      ? categories
      : [
          { _id: "1", name: "Classics", slug: "classics", productCount: 12 },
          { _id: "2", name: "Sorbets", slug: "sorbets", productCount: 8 },
          { _id: "3", name: "Sundaes", slug: "sundaes", productCount: 6 },
          { _id: "4", name: "Seasonal", slug: "seasonal", productCount: 5 },
          { _id: "5", name: "Vegan", slug: "vegan", productCount: 9 },
          { _id: "6", name: "Premium", slug: "premium", productCount: 7 },
          { _id: "7", name: "Novelties", slug: "novelties", productCount: 10 },
          { _id: "8", name: "Sugar-Free", slug: "sugar-free", productCount: 4 },
        ] as Category[];

  return (
    <section className="py-16 bg-gray-50 dark:bg-dark-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-primary font-semibold text-sm mb-2">
            🏪 Browse by Type
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-text">
            Explore <span className="text-secondary">Categories</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayCategories.slice(0, 8).map((category, index) => {
            const emoji = categoryEmojis[category.slug] || "🍦";
            const colorClass =
              categoryColors[category.slug] || "from-primary/20 to-pink-200";

            return (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group block"
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`relative h-32 rounded-2xl bg-gradient-to-br ${colorClass} flex flex-col items-center justify-center gap-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-white/50 dark:border-dark-border`}
                  >
                    {/* Background Emoji */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 text-8xl">
                      {emoji}
                    </div>

                    {/* Content */}
                    <span className="text-4xl relative z-10">{emoji}</span>
                    <div className="text-center relative z-10">
                      <p className="font-semibold text-gray-800 text-sm">
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.productCount} items
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
