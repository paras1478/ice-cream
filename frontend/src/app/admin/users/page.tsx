"use client";

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/users?limit=50")
      .then((r) => r.json())
      .then((d) => setUsers(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminHeader title="Customers" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full dark:text-dark-text"
            />
          </div>
        </div>

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
                    {["User", "Email", "Role", "Joined"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center">
                        <Users className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No users found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-50 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-ice flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={user.role === "admin" ? "ice" : "default"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
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
