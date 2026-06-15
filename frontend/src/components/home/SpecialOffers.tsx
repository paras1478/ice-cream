"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const offers = [
  {
    id: 1,
    title: "Summer Splash Sale",
    description: "Get 20% off all fruit-based ice creams this summer season",
    discount: "20% OFF",
    code: "SUMMER20",
    bgColor: "from-primary to-pink-400",
    emoji: "🍓",
    expiry: "Limited time",
  },
  {
    id: 2,
    title: "Family Bundle Deal",
    description: "Buy 4 scoops, get the 5th scoop absolutely free",
    discount: "BUY 4 GET 1",
    code: "FAMILY5",
    bgColor: "from-secondary to-teal-400",
    emoji: "👨‍👩‍👧‍👦",
    expiry: "Weekends only",
  },
  {
    id: 3,
    title: "New Member Special",
    description: "First order gets 15% off with free delivery anywhere",
    discount: "15% OFF",
    code: "WELCOME15",
    bgColor: "from-purple-500 to-indigo-500",
    emoji: "🎉",
    expiry: "First order only",
  },
];

export function SpecialOffers() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-dark-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-primary font-semibold text-sm mb-2">
            🏷️ Limited Time Offers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-text">
            Special <span className="text-secondary">Deals</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className={`relative rounded-3xl bg-gradient-to-br ${offer.bgColor} p-6 text-white overflow-hidden shadow-lg`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-9xl">{offer.emoji}</div>
              </div>

              <div className="relative z-10">
                {/* Discount Badge */}
                <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm font-bold mb-4">
                  <Tag className="h-3.5 w-3.5" />
                  {offer.discount}
                </div>

                <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                <p className="text-white/80 text-sm mb-4">{offer.description}</p>

                {/* Code */}
                <div className="bg-white/20 rounded-xl px-4 py-2 mb-4 inline-block">
                  <p className="text-xs text-white/70 mb-0.5">Use code:</p>
                  <p className="font-bold tracking-wider">{offer.code}</p>
                </div>

                {/* Expiry */}
                <div className="flex items-center gap-1.5 text-white/70 text-xs mb-5">
                  <Clock className="h-3.5 w-3.5" />
                  {offer.expiry}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-white border border-white/30 hover:bg-white/20 w-full justify-between"
                >
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
