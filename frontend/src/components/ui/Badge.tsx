import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-700 dark:bg-primary/20 dark:text-primary-300",
        secondary: "bg-secondary-100 text-secondary-700 dark:bg-secondary/20 dark:text-secondary-300",
        accent: "bg-accent-100 text-accent-700",
        success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        outline: "border border-current bg-transparent",
        ice: "bg-gradient-ice text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
