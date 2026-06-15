import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import { PackageX } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  loading,
  skeletonCount = 12,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="text-6xl mb-4">🍦</div>
        <PackageX className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          We couldn't find any ice cream matching your filters. Try adjusting
          your search or filters.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
