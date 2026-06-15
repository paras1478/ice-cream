"use client";

import { motion } from "framer-motion";
import { StarRating } from "@/components/ui/StarRating";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Blogger",
    avatar: "SJ",
    rating: 5,
    comment:
      "Absolutely the best ice cream I've ever tasted! The strawberry dream flavor is out of this world. Fresh, creamy, and the perfect sweetness. I order every week!",
    flavor: "Strawberry Dream",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Chef",
    avatar: "MC",
    rating: 5,
    comment:
      "As a chef, I'm picky about ingredients quality. ScoopHeaven uses premium ingredients and you can taste the difference. Their pistachio flavor is simply exceptional.",
    flavor: "Pistachio Premium",
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Parent",
    avatar: "ED",
    rating: 5,
    comment:
      "My kids absolutely love ScoopHeaven! The delivery is always on time, the packaging is adorable, and the ice cream is always fresh and delicious. 10/10!",
    flavor: "Rainbow Swirl",
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Regular Customer",
    avatar: "JW",
    rating: 4,
    comment:
      "I've tried many ice cream brands, but nothing comes close to ScoopHeaven. The variety is amazing and the seasonal specials are always exciting!",
    flavor: "Mint Chocolate Chip",
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Ice Cream Enthusiast",
    avatar: "PP",
    rating: 5,
    comment:
      "The mango sorbet is my absolute favorite! Perfect for summer days. They nail the authentic tropical flavor. Plus, fast delivery and great packaging.",
    flavor: "Tropical Mango",
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Fitness Coach",
    avatar: "RK",
    rating: 5,
    comment:
      "Love that they have low-calorie options without compromising on taste! Their Greek yogurt sorbet is my guilt-free treat after workouts.",
    flavor: "Greek Yogurt Sorbet",
  },
];

const avatarColors = [
  "from-primary to-pink-400",
  "from-secondary to-teal-400",
  "from-purple-500 to-indigo-400",
  "from-amber-400 to-orange-400",
  "from-rose-400 to-pink-400",
  "from-blue-400 to-cyan-400",
];

export function Testimonials() {
  return (
    <section className="py-16 bg-white dark:bg-dark-bg overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary font-semibold text-sm mb-2">
            💬 Customer Love
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-text">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Don't just take our word for it — hear from our happy scoop lovers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative bg-gray-50 dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-dark-text">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <StarRating rating={testimonial.rating} size="sm" className="mb-3" />

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                &ldquo;{testimonial.comment}&rdquo;
              </p>

              <div className="inline-flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1">
                <span className="text-xs">🍦</span>
                <span className="text-xs font-medium text-primary">
                  {testimonial.flavor}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
