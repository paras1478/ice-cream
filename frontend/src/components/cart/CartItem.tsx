"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 bg-gray-50 dark:bg-dark-bg rounded-xl p-3"
    >
      {/* Image */}
      <Link href={`/products/${product._id}`} className="flex-shrink-0">
        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-white dark:bg-dark-border">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-2xl">
              🍦
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product._id}`}>
          <p className="text-sm font-semibold text-gray-900 dark:text-dark-text line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </p>
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {product.flavor}
        </p>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateQuantity(product._id, quantity - 1)}
              className="h-6 w-6 flex items-center justify-center rounded-md bg-white dark:bg-dark-border text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-colors shadow-sm"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product._id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="h-6 w-6 flex items-center justify-center rounded-md bg-white dark:bg-dark-border text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">
              {formatPrice(product.price * quantity)}
            </span>
            <button
              onClick={() => removeFromCart(product._id, product.name)}
              className="h-6 w-6 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
