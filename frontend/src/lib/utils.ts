import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

export function formatDateShort(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}
