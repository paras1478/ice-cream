"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inWishlist = isInWishlist(product._id);
  const discountPercent =
    product.comparePrice && product.comparePrice > product.price
      ? calculateDiscountPercentage(product.comparePrice, product.price)
      : 0;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-dark-card dark:border-dark-border"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-pink-50 to-cyan-50 dark:from-dark-border dark:to-dark-bg">
        {product.images?.[0] && !imageError ? (
          <motion.div
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </motion.div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-7xl">
            🍦
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <Badge variant="ice" className="text-[10px] px-2 py-0.5">
              ⭐ Featured
            </Badge>
          )}
          {discountPercent > 0 && (
            <Badge variant="danger" className="text-[10px] px-2 py-0.5">
              -{discountPercent}%
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="warning" className="text-[10px] px-2 py-0.5">
              Out of Stock
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="warning" className="text-[10px] px-2 py-0.5">
              Low Stock
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-3 right-3 flex flex-col gap-2"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`h-9 w-9 flex items-center justify-center rounded-full shadow-md transition-all ${
              inWishlist
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-primary hover:text-white"
            }`}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
          </button>
          <Link
            href={`/products/${product._id}`}
            className="h-9 w-9 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-md hover:bg-secondary hover:text-white transition-all"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Quick Add */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 left-3 right-3"
        >
          <Button
            size="sm"
            className="w-full shadow-lg"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </motion.div>
      </div>

      {/* Content */}
      <Link href={`/products/${product._id}`}>
        <div className="p-4">
          {/* Category & Flavor */}
          <p className="text-xs text-secondary font-medium mb-1.5 uppercase tracking-wide">
            {product.flavor}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 dark:text-dark-text line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-dark-text">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              disabled={isOutOfStock}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
