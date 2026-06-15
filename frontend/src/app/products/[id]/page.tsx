"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  AlertTriangle,
  Leaf,
  Package,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { NutritionTable } from "@/components/products/NutritionTable";
import { ReviewSection } from "@/components/products/ReviewSection";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "nutrition" | "reviews"
  >("description");

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header onMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="min-h-screen pt-20 container mx-auto px-4 py-8">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header onMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🍦</p>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              Product not found
            </h2>
            <Button className="mt-4" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const discountPercent =
    product.comparePrice && product.comparePrice > product.price
      ? calculateDiscountPercentage(product.comparePrice, product.price)
      : 0;
  const category =
    typeof product.category === "object" ? product.category : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="min-h-screen bg-white dark:bg-dark-bg pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            {category && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link
                  href={`/products?category=${category.slug}`}
                  className="hover:text-primary"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">
              {product.name}
            </span>
          </nav>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ProductImageGallery
                images={product.images}
                productName={product.name}
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.isFeatured && (
                  <Badge variant="ice">⭐ Featured</Badge>
                )}
                {discountPercent > 0 && (
                  <Badge variant="danger">-{discountPercent}% OFF</Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="warning">Out of Stock</Badge>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <Badge variant="warning">
                    Only {product.stock} left!
                  </Badge>
                )}
              </div>

              {/* Title */}
              <div>
                <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-1">
                  {product.flavor} · {category?.name}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} size="md" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900 dark:text-dark-text">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                {product.weight && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Package className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Weight: {product.weight}</span>
                  </div>
                )}
                {product.servingSize && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Leaf className="h-4 w-4 text-secondary flex-shrink-0" />
                    <span>Serving: {product.servingSize}</span>
                  </div>
                )}
              </div>

              {/* Allergens */}
              {product.allergens && product.allergens.length > 0 && (
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-700 dark:text-amber-400">
                      Contains Allergens:
                    </p>
                    <p className="text-amber-600 dark:text-amber-500">
                      {product.allergens.join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900 dark:text-dark-text">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {product.stock} available
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`h-12 w-12 flex items-center justify-center rounded-xl border-2 transition-all ${
                      inWishlist
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="h-12 w-12 flex items-center justify-center rounded-xl border-2 border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-secondary hover:text-secondary transition-all"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <div className="flex border-b border-gray-200 dark:border-dark-border mb-6">
              {(
                [
                  { id: "description", label: "Description" },
                  { id: "nutrition", label: "Nutrition Facts" },
                  { id: "reviews", label: `Reviews (${product.reviewCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-2xl"
              >
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {product.description}
                </p>
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-3">
                      Ingredients
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="text-sm bg-primary/10 text-primary rounded-full px-3 py-1"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "nutrition" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-sm"
              >
                <NutritionTable
                  facts={product.nutritionFacts}
                  servingSize={product.servingSize}
                />
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ReviewSection productId={product._id} />
              </motion.div>
            )}
          </div>

          {/* Related Products */}
          <RelatedProducts
            productId={product._id}
            categoryId={
              typeof product.category === "object"
                ? product.category._id
                : product.category
            }
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
