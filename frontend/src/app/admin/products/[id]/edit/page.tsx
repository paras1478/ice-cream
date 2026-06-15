"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setProduct(d.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Product" />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-dark-border rounded w-1/3" />
            <div className="h-64 bg-gray-200 dark:bg-dark-border rounded-2xl" />
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AdminHeader title="Edit Product" />
        <div className="p-6">
          <p className="text-gray-500">Product not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Edit: ${product.name}`} />
      <div className="p-6 max-w-4xl">
        <ProductForm product={product} isEdit />
      </div>
    </>
  );
}
