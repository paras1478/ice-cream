import Image from "next/image";
import { CartSummary } from "@/components/cart/CartSummary";
import type { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
}

export function OrderSummary({
  items,
  subtotal,
  discount,
  tax,
  shippingFee,
  total,
  couponCode,
}: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5">
        <h3 className="font-bold text-gray-900 dark:text-dark-text mb-4">
          Order Items ({items.length})
        </h3>
        <div className="space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-dark-border">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-xl">🍦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">Qty: {quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                {formatPrice(product.price * quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <CartSummary
        subtotal={subtotal}
        discount={discount}
        tax={tax}
        shippingFee={shippingFee}
        total={total}
        couponCode={couponCode}
      />
    </div>
  );
}
