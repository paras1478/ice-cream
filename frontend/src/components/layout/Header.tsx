"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  Menu,
  User,
  LogOut,
  Package,
  Settings,
  ChevronDown,
  Search,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuOpen?: () => void;
}

export function Header({ onMenuOpen }: HeaderProps) {
  const { data: session } = useSession();
  const { itemCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Menu" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-dark-bg/90"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-ice text-white text-xl font-bold shadow-ice">
              🍦
            </div>
            <span className="text-xl font-bold">
              <span className="text-primary">Scoop</span>
              <span className="text-secondary">Heaven</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors dark:hover:bg-dark-border dark:text-gray-400"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors dark:hover:bg-dark-border dark:text-gray-400"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Wishlist */}
            <Link
              href="/profile/wishlist"
              className="relative h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors dark:hover:bg-dark-border dark:text-gray-400"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-xs text-white font-bold">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors dark:hover:bg-dark-border dark:text-gray-400"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-xs text-white font-bold"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </button>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-dark-border"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-gradient-ice flex items-center justify-center text-white text-xs font-bold">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg py-1 dark:bg-dark-card dark:border-dark-border"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-dark-border">
                        <p className="text-sm font-medium text-gray-900 dark:text-dark-text truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-border"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-border"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-border"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              onClick={onMenuOpen}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3"
            >
              <form
                action="/products"
                method="get"
                className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 dark:bg-dark-card"
              >
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ice cream flavors..."
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 dark:text-dark-text placeholder:text-gray-400"
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
