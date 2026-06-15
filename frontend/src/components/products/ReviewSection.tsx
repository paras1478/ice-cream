"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Star } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Review } from "@/types";

interface ReviewSectionProps {
  productId: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please login to write a review");
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productId }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => [data.data, ...prev]);
        setFormData({ rating: 5, title: "", comment: "" });
        setShowForm(false);
        toast.success("Review submitted successfully!");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to submit review");
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) *
          100
        : 0,
  }));

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6">
        Customer Reviews
      </h2>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 dark:bg-dark-card rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6">
          <div className="text-center">
            <p className="text-6xl font-black text-gray-900 dark:text-dark-text">
              {averageRating.toFixed(1)}
            </p>
            <StarRating rating={averageRating} size="md" className="justify-center my-2" />
            <p className="text-sm text-gray-500">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ star, count, percent }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm w-6 text-gray-600 dark:text-gray-400">{star}</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-500 w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review */}
      <div className="mb-6">
        {session ? (
          <Button onClick={() => setShowForm(!showForm)} variant="outline">
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        ) : (
          <p className="text-sm text-gray-500">
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>{" "}
            to write a review
          </p>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 mb-8 overflow-hidden"
          >
            <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-4">
              Your Review
            </h3>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </p>
              <StarRating
                rating={formData.rating}
                size="lg"
                interactive
                onRatingChange={(r) => setFormData({ ...formData, rating: r })}
              />
            </div>

            <div className="mb-4">
              <Input
                label="Review Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Your Review
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Tell us what you liked or disliked..."
                rows={4}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm text-gray-700 dark:text-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <Button type="submit" loading={submitting}>
              Submit Review
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-full mb-1" />
              <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-3">💬</p>
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-100 dark:border-dark-border pb-6 last:border-0"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-ice flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {typeof review.user === "object"
                    ? review.user.name?.[0]?.toUpperCase()
                    : "U"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 dark:text-dark-text">
                      {typeof review.user === "object" ? review.user.name : "User"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <StarRating rating={review.rating} size="sm" className="mt-1" />
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {review.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {review.comment}
              </p>
              {review.isVerifiedPurchase && (
                <p className="mt-2 text-xs text-green-600 font-medium">
                  ✓ Verified Purchase
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
