"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  Boxes,
  Settings,
  Ticket,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100 dark:border-dark-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-ice text-white text-xl">
            🍦
          </div>
          <div>
            <p className="font-bold text-sm">
              <span className="text-primary">Scoop</span>
              <span className="text-secondary">Heaven</span>
            </p>
            <p className="text-[10px] text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                active
                  ? "bg-primary text-white shadow-ice"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-gray-400 dark:hover:bg-dark-border dark:hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{label}</span>
              {active && (
                <ChevronRight className="h-3.5 w-3.5 ml-auto" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-dark-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-all dark:text-gray-400 dark:hover:bg-dark-border"
        >
          <Settings className="h-4 w-4" />
          Go to Store
        </Link>
      </div>
    </aside>
  );
}
