"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";

const faqs = [
  {
    category: "Orders & Delivery",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 1-3 business days. We use insulated packaging to keep your ice cream perfectly frozen during transit.",
      },
      {
        q: "Is free delivery available?",
        a: "Yes! We offer free delivery on all orders over $50. For orders under $50, a flat fee of $5.99 applies.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also check the status in your account under 'My Orders'.",
      },
      {
        q: "Do you deliver to all states?",
        a: "We currently deliver to the contiguous 48 US states. We're working on expanding to Alaska and Hawaii soon!",
      },
    ],
  },
  {
    category: "Products & Quality",
    questions: [
      {
        q: "Are your products allergen-free?",
        a: "Our products contain various allergens including milk, eggs, nuts, and soy. Each product page lists all allergens clearly. Please check before ordering if you have food allergies.",
      },
      {
        q: "How are the ice creams made?",
        a: "All our ice creams are handcrafted in small batches using premium, locally-sourced ingredients when possible. No artificial colors or preservatives.",
      },
      {
        q: "Are there vegan options?",
        a: "Yes! We have a dedicated vegan range made with coconut milk and oat milk bases. These are labeled as 'Vegan' in our product catalog.",
      },
      {
        q: "How should I store my ice cream?",
        a: "Store at -18°C (0°F) or below. Best consumed within 3 months of purchase. Once opened, press plastic wrap against the surface to prevent ice crystals.",
      },
    ],
  },
  {
    category: "Payments & Returns",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards via Stripe, and Cash on Delivery for select areas.",
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled within 2 hours of placement. After that, they enter processing and cannot be cancelled. Contact us immediately at hello@scoopheaven.com.",
      },
      {
        q: "What if my ice cream arrives melted?",
        a: "We guarantee the quality of our products. If your ice cream arrives melted or damaged, contact us within 24 hours with photos and we'll send a replacement or issue a full refund.",
      },
      {
        q: "How do coupon codes work?",
        a: "Enter your coupon code at checkout in the 'Coupon Code' field. Discounts apply automatically. Each code can only be used once per account unless otherwise specified.",
      },
    ],
  },
];

export default function FAQPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFaqs = faqs
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          !searchQuery ||
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-gray-100 dark:border-dark-border">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Everything you need to know about ScoopHeaven
            </p>
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-dark-text"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          {filteredFaqs.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;
                  const isOpen = openItems[key];

                  return (
                    <div
                      key={qIndex}
                      className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="flex items-center justify-between w-full p-5 text-left"
                      >
                        <span className="font-semibold text-gray-800 dark:text-gray-200 pr-4">
                          {faq.q}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 dark:text-gray-400">
                No results found for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Still need help */}
          <div className="mt-10 bg-gradient-ice rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-white/80 mb-4 text-sm">
              Our team is here to help you 7 days a week.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
