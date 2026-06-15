import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Product",
};

export default function NewProductPage() {
  return (
    <>
      <AdminHeader title="Add New Product" />
      <div className="p-6 max-w-4xl">
        <ProductForm />
      </div>
    </>
  );
}
