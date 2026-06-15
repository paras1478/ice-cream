"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

const floatingIceCreams = [
  { emoji: "🍦", x: "10%", y: "20%", delay: 0, size: "text-5xl" },
  { emoji: "🍨", x: "80%", y: "15%", delay: 0.5, size: "text-4xl" },
  { emoji: "🍧", x: "75%", y: "70%", delay: 1, size: "text-6xl" },
  { emoji: "🍡", x: "5%", y: "75%", delay: 1.5, size: "text-3xl" },
  { emoji: "🧁", x: "50%", y: "85%", delay: 0.8, size: "text-4xl" },
];

const badges = [
  { icon: Star, text: "4.9/5 Rating", color: "text-amber-500" },
  { icon: Truck, text: "Free Delivery $50+", color: "text-secondary" },
  { icon: Shield, text: "Fresh Guarantee", color: "text-primary" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-cyan-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        />
      </div>

      {/* Floating Ice Creams */}
      {floatingIceCreams.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.size} pointer-events-none select-none`}
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 3 + index * 0.5,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6"
            >
              <span className="text-lg">🍦</span>
              <span className="text-primary font-semibold text-sm">
                Artisan Ice Cream since 2010
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-dark-text leading-tight"
            >
              Discover Your{" "}
              <span className="relative">
                <span className="text-primary">Perfect</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-ice rounded-full"
                />
              </span>{" "}
              <span className="text-secondary">Scoop</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-lg"
            >
              Handcrafted with premium ingredients, our ice cream is made fresh
              daily. From classic flavors to unique seasonal creations — there's
              a scoop for every mood.
            </motion.p>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mt-6"
            >
              {badges.map(({ icon: Icon, text, color }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                  {text}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Button size="lg" asChild className="group">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/products?isFeatured=true">View Specials</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-8 mt-10 pt-8 border-t border-gray-200 dark:border-dark-border"
            >
              {[
                { value: "50+", label: "Flavors" },
                { value: "10K+", label: "Happy Customers" },
                { value: "4.9★", label: "Average Rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                    {value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Ice Cream Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Main Ice Cream SVG */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-ice opacity-20 blur-3xl scale-150" />

              {/* Large Ice Cream Emoji */}
              <div className="relative text-[200px] leading-none select-none drop-shadow-2xl">
                🍦
              </div>

              {/* Floating Mini Scoops */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                {["🍓", "🫐", "🥭", "🍋", "🍵"].map((emoji, i) => {
                  const angle = (i / 5) * 360;
                  const radius = 120;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  return (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      }}
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {emoji}
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Flavor Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute -right-4 top-1/4 bg-white dark:bg-dark-card rounded-2xl shadow-lg p-3 flex items-center gap-2"
            >
              <span className="text-2xl">🍓</span>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-dark-text">
                  Strawberry Dream
                </p>
                <p className="text-xs text-primary font-semibold">$5.99</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -left-4 bottom-1/3 bg-white dark:bg-dark-card rounded-2xl shadow-lg p-3 flex items-center gap-2"
            >
              <span className="text-2xl">🫐</span>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-dark-text">
                  Blueberry Bliss
                </p>
                <p className="text-xs text-secondary font-semibold">$6.49</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 36.7C1200 33.3 1320 26.7 1380 23.3L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            className="fill-white dark:fill-dark-bg"
          />
        </svg>
      </div>
    </section>
  );
}
