"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back! 🍦");
        router.push(callbackUrl);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-card rounded-3xl shadow-xl border border-gray-100 dark:border-dark-border p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-ice shadow-ice mb-4">
          <span className="text-3xl">🍦</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
          Welcome Back!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Sign in to your ScoopHeaven account
        </p>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 dark:border-dark-border px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors mb-6"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-dark-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-dark-card px-2 text-gray-400">
            or sign in with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded accent-primary" />
            <span className="text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary hover:text-primary-600 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-primary hover:text-primary-600 font-semibold"
        >
          Create Account
        </Link>
      </p>
    </motion.div>
  );
}
