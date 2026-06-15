"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/types";

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
}

export function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `/api/products?category=${categoryId}&limit=4&exclude=${productId}`
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data.data?.filter((p: Product) => p._id !== productId).slice(0, 4) || []);
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [productId, categoryId]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </div>
  );
}
