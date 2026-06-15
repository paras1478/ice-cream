"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=50&sort=-createdAt");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success(`"${name}" deleted successfully`);
      } else {
        toast.error("Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.flavor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminHeader title="Products" />
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-primary w-72 dark:text-dark-text"
            />
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">
                      Product
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">
                      Category
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">
                      Price
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">
                      Stock
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center">
                        <Package className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {search ? "No products match your search" : "No products yet"}
                        </p>
                        {!search && (
                          <Button className="mt-4" size="sm" asChild>
                            <Link href="/admin/products/new">Add First Product</Link>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((product) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-50 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border flex-shrink-0">
                              {product.images?.[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="h-full flex items-center justify-center text-lg">
                                  🍦
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {product.flavor}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {typeof product.category === "object"
                              ? product.category.name
                              : "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {formatPrice(product.price)}
                          </p>
                          {product.comparePrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(product.comparePrice)}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-sm font-medium ${
                              product.stock === 0
                                ? "text-red-500"
                                : product.stock < 10
                                ? "text-amber-500"
                                : "text-green-600"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1.5">
                            {product.isActive ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="danger">Inactive</Badge>
                            )}
                            {product.isFeatured && (
                              <Badge variant="ice">Featured</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/products/${product._id}/edit`}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(product._id, product.name)
                              }
                              disabled={deleting === product._id}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
