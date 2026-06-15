"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Home,
  ShoppingBag,
  User,
  Package,
  Heart,
  Phone,
  HelpCircle,
  LogOut,
  LogIn,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Shop", icon: ShoppingBag },
  { href: "/profile/wishlist", label: "Wishlist", icon: Heart },
  { href: "/profile/orders", label: "Orders", icon: Package },
  { href: "/contact", label: "Contact", icon: Phone },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-dark-card shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-border">
                <Link href="/" onClick={onClose} className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-ice text-white text-xl">
                    🍦
                  </div>
                  <span className="text-lg font-bold">
                    <span className="text-primary">Scoop</span>
                    <span className="text-secondary">Heaven</span>
                  </span>
                </Link>
                <button
                  onClick={onClose}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Info */}
              {session && (
                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-gray-100 dark:border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-ice flex items-center justify-center text-white font-bold">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-dark-text text-sm">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors dark:text-gray-300 dark:hover:bg-primary/10"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}

                {session?.user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors dark:text-gray-300"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                )}
              </nav>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-100 dark:border-dark-border">
                {session ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      onClose();
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/login" onClick={onClose}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/register" onClick={onClose}>
                        <User className="h-4 w-4 mr-2" />
                        Create Account
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
