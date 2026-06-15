"use client";

import { useEffect, useState } from "react";
import { Plus, Ticket, Trash2, Copy } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Coupon } from "@/types";
import toast from "react-hot-toast";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    minOrderAmount: 0,
    maxUses: 0,
    expiresAt: "",
  });

  useEffect(() => {
    fetch("/api/coupons")
      .then((r) => r.json())
      .then((d) => setCoupons(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!formData.code || !formData.value) {
      toast.error("Code and value are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase(),
          minOrderAmount: formData.minOrderAmount || undefined,
          maxUses: formData.maxUses || undefined,
          expiresAt: formData.expiresAt || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCoupons((prev) => [data.data, ...prev]);
        setIsModalOpen(false);
        setFormData({ code: "", type: "percentage", value: 0, minOrderAmount: 0, maxUses: 0, expiresAt: "" });
        toast.success("Coupon created!");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to create coupon");
      }
    } catch {
      toast.error("Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
        toast.success("Coupon deleted!");
      }
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard!`);
  };

  return (
    <>
      <AdminHeader title="Coupons" />
      <div className="p-6">
        <div className="flex justify-end mb-6">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-dark-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                  {["Code", "Type", "Value", "Uses", "Min Order", "Expires", "Status", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <Ticket className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No coupons yet</p>
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                    const isExhausted = coupon.maxUses && coupon.usedCount >= coupon.maxUses;

                    return (
                      <tr
                        key={coupon._id}
                        className="border-b border-gray-50 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-primary">
                              {coupon.code}
                            </span>
                            <button
                              onClick={() => copyCode(coupon.code)}
                              className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-primary transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {coupon.type}
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {coupon.type === "percentage"
                            ? `${coupon.value}%`
                            : formatPrice(coupon.value)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {coupon.usedCount}
                          {coupon.maxUses ? `/${coupon.maxUses}` : ""}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {coupon.minOrderAmount
                            ? formatPrice(coupon.minOrderAmount)
                            : "—"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"}
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            variant={
                              !coupon.isActive || isExpired || isExhausted
                                ? "danger"
                                : "success"
                            }
                          >
                            {!coupon.isActive
                              ? "Inactive"
                              : isExpired
                              ? "Expired"
                              : isExhausted
                              ? "Exhausted"
                              : "Active"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleDelete(coupon._id, coupon.code)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Coupon">
        <div className="space-y-4">
          <Input
            label="Coupon Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="e.g., SUMMER20"
            className="uppercase font-mono"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "percentage" | "fixed" })}
                className="w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <Input
              label={`Value (${formData.type === "percentage" ? "%" : "$"})`}
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              placeholder="10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Order ($)"
              type="number"
              value={formData.minOrderAmount || ""}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
              placeholder="0 = no minimum"
            />
            <Input
              label="Max Uses"
              type="number"
              value={formData.maxUses || ""}
              onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
              placeholder="0 = unlimited"
            />
          </div>
          <Input
            label="Expiry Date"
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" loading={saving} onClick={handleCreate}>
              Create Coupon
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
