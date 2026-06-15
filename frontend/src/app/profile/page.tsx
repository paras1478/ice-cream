"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Camera, Save } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import Link from "next/link";
import { Package, Heart } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user.name || "",
    email: session?.user.email || "",
    phone: "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${session?.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, phone: formData.phone }),
      });

      if (res.ok) {
        await update({ name: formData.name });
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { href: "/profile/orders", icon: Package, label: "My Orders", desc: "View order history" },
    { href: "/profile/wishlist", icon: Heart, label: "Wishlist", desc: "Saved items" },
  ];

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-8">
            My Profile
          </h1>

          {/* Avatar Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 mb-6"
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-ice flex items-center justify-center text-white text-2xl font-bold shadow-ice">
                  {session?.user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-dark-text">
                  {session?.user.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {session?.user.email}
                </p>
                <p className="text-xs text-primary mt-1 capitalize">
                  {session?.user.role} Account
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {quickLinks.map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-4 hover:shadow-md transition-all cursor-pointer"
                >
                  <Icon className="h-6 w-6 text-primary mb-2" />
                  <p className="font-semibold text-gray-900 dark:text-dark-text">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-5">
              Edit Profile
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                leftIcon={<User className="h-4 w-4" />}
                placeholder="Your full name"
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                leftIcon={<Mail className="h-4 w-4" />}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                leftIcon={<Phone className="h-4 w-4" />}
                placeholder="+1 (555) 123-4567"
              />
              <Button type="submit" loading={loading} className="w-full gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
