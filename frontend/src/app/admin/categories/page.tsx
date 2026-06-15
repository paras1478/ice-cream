"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Category } from "@/types";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setFormData({ name: category.name, description: category.description || "" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/categories/${editing._id}` : "/api/categories";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editing ? "Category updated!" : "Category created!");
        fetchCategories();
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save");
      }
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        toast.success("Category deleted!");
      } else {
        toast.error("Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <>
      <AdminHeader title="Categories" />
      <div className="p-6">
        <div className="flex justify-end mb-6">
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-dark-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, index) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-dark-text">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.productCount} products
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            {categories.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <Tag className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No categories yet. Create one to get started!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Edit Category" : "Add Category"}
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Classic Flavors"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description..."
              rows={3}
              className="w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" loading={saving} onClick={handleSave}>
              {editing ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
