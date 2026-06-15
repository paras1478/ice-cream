"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!formData.email || !formData.email.includes("@"))
      newErrors.email = "Invalid email address";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created! Signing you in... 🍦");
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        router.push("/");
      } else {
        toast.error(data.message || "Failed to create account");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-card rounded-3xl shadow-xl border border-gray-100 dark:border-dark-border p-8"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-ice shadow-ice mb-4">
          <span className="text-3xl">🍦</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
          Create Account
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Join ScoopHeaven for exclusive deals!
        </p>
      </div>

      {/* Google Sign In */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 dark:border-dark-border px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors mb-6"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-dark-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-dark-card px-2 text-gray-400">
            or create with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name}
          required
        />
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Min. 8 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          error={errors.password}
          required
        />
        <Input
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder="Re-enter password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword}
          required
        />

        <p className="text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary-600 font-semibold">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
