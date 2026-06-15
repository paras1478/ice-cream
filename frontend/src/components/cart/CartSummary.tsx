import { formatPrice } from "@/lib/utils";
import { Tag } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
}

export function CartSummary({
  subtotal,
  discount,
  tax,
  shippingFee,
  total,
  couponCode,
}: CartSummaryProps) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6">
      <h3 className="font-bold text-gray-900 dark:text-dark-text text-lg mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {couponCode && discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              Coupon ({couponCode})
            </span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Tax (8%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Shipping</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>

        {shippingFee > 0 && (
          <p className="text-xs text-gray-400 bg-gray-50 dark:bg-dark-bg rounded-lg px-3 py-2">
            Add {formatPrice(50 - subtotal)} more for free shipping
          </p>
        )}

        <div className="border-t border-gray-100 dark:border-dark-border pt-3 mt-1">
          <div className="flex justify-between text-base font-bold text-gray-900 dark:text-dark-text">
            <span>Total</span>
            <span className="text-primary text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
