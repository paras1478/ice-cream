import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | Admin - ScoopHeaven",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
