"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Heart className="h-7 w-7 text-primary fill-primary" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                My Wishlist
              </h1>
              {items.length > 0 && (
                <span className="text-gray-500 dark:text-gray-400">
                  ({items.length} items)
                </span>
              )}
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearWishlist}
                className="text-red-500 hover:text-red-600"
              >
                Clear All
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                💝
              </motion.div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                Save your favorite ice cream flavors to your wishlist for easy
                access later.
              </p>
              <Button asChild>
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Browse Ice Creams
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
