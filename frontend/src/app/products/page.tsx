"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSearch } from "@/components/products/ProductSearch";
import { ProductSort } from "@/components/products/ProductSort";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        if (!params.has("limit")) params.set("limit", String(limit));
        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.data || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const totalPages = Math.ceil(total / limit);

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `/products?${params.toString()}`;
  };

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 border-b border-gray-100 dark:border-dark-border">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-1">
              🍦 Our Ice Cream Menu
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {loading ? "Loading..." : `${total} delicious flavors`}
              {searchParams.get("search") && (
                <span className="ml-2 text-primary font-medium">
                  for "{searchParams.get("search")}"
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <Suspense>
                <ProductSearch />
              </Suspense>
            </div>
            <div className="flex items-center gap-3">
              <Suspense>
                <ProductSort />
              </Suspense>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <Suspense>
                  <ProductFilters />
                </Suspense>
              </div>
            </aside>

            {/* Mobile Filters */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden w-full overflow-hidden"
                >
                  <Suspense>
                    <ProductFilters className="mb-6" />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products */}
            <div className="flex-1 min-w-0">
              <ProductGrid
                products={products}
                loading={loading}
                skeletonCount={12}
              />

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    asChild
                  >
                    <a href={buildPageUrl(page - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </a>
                  </Button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <a
                        key={p}
                        href={buildPageUrl(p)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                          p === page
                            ? "bg-primary text-white shadow-ice"
                            : "bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {p}
                      </a>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= totalPages}
                    asChild
                  >
                    <a href={buildPageUrl(page + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
