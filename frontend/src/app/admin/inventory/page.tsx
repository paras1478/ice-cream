"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products?limit=100&sort=stock")
      .then((r) => r.json())
      .then((d) => setProducts(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const updateStock = async (productId: string, newStock: number) => {
    setSaving(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, stock: newStock } : p))
        );
        const newEditing = { ...editingStock };
        delete newEditing[productId];
        setEditingStock(newEditing);
        toast.success("Stock updated!");
      } else {
        toast.error("Failed to update stock");
      }
    } catch {
      toast.error("Failed to update stock");
    } finally {
      setSaving(null);
    }
  };

  const lowStock = products.filter((p) => p.stock < 10 && p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <>
      <AdminHeader title="Inventory" />
      <div className="p-6 space-y-6">
        {/* Alerts */}
        {(outOfStock.length > 0 || lowStock.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {outOfStock.length > 0 && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400">
                    {outOfStock.length} Out of Stock
                  </p>
                  <p className="text-xs text-red-500">Immediate restocking needed</p>
                </div>
              </div>
            )}
            {lowStock.length > 0 && (
              <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                <TrendingDown className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-400">
                    {lowStock.length} Low Stock
                  </p>
                  <p className="text-xs text-amber-500">Stock below 10 units</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inventory Table */}
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
                    {["Product", "Price", "Current Stock", "Status", "Update Stock"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const isEditing = editingStock[product._id] !== undefined;
                    const stockValue = isEditing ? editingStock[product._id] : product.stock;

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-gray-50 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/50"
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
                                <div className="h-full flex items-center justify-center text-lg">🍦</div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">{product.flavor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-lg font-bold ${
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
                          <Badge
                            variant={
                              product.stock === 0
                                ? "danger"
                                : product.stock < 10
                                ? "warning"
                                : "success"
                            }
                          >
                            {product.stock === 0
                              ? "Out of Stock"
                              : product.stock < 10
                              ? "Low Stock"
                              : "In Stock"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={stockValue}
                              onChange={(e) =>
                                setEditingStock({
                                  ...editingStock,
                                  [product._id]: Number(e.target.value),
                                })
                              }
                              className="w-20 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {isEditing && (
                              <Button
                                size="sm"
                                loading={saving === product._id}
                                onClick={() =>
                                  updateStock(product._id, editingStock[product._id])
                                }
                              >
                                Save
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
