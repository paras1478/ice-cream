"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
    toast.success("Thanks for subscribing! 🍦");
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-pink-500 to-secondary" />
      <div className="absolute inset-0 opacity-10">
        {["🍦", "🍧", "🍨", "🍡", "🧁"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${i * 20 + 5}%`,
              top: `${Math.sin(i) * 30 + 30}%`,
              opacity: 0.3,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-white"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Exclusive Deals & New Flavors First!
          </h2>
          <p className="text-white/80 mb-8">
            Subscribe to our newsletter and get 10% off your first order, plus
            be the first to know about new seasonal flavors and exclusive offers.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4"
            >
              <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold">You're subscribed!</p>
                <p className="text-white/70 text-sm">
                  Check your inbox for your 10% discount code.
                </p>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-white/50"
                required
              />
              <Button
                type="submit"
                loading={loading}
                className="bg-white text-primary hover:bg-white/90 font-semibold whitespace-nowrap"
              >
                Subscribe & Save 10%
              </Button>
            </form>
          )}

          <p className="mt-4 text-white/60 text-xs">
            No spam, ever. Unsubscribe anytime. We respect your privacy.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              "🎁 10% welcome discount",
              "🍦 New flavor alerts",
              "💌 Exclusive member offers",
            ].map((benefit) => (
              <div
                key={benefit}
                className="text-sm text-white/80 flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                {benefit}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
