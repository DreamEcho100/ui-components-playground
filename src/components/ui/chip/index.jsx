import { cn } from "~/lib/utils";
import { badgeVariants } from "./utils";
import { forwardRef } from "react";

const Chip = forwardRef(
  /**
   * @param {import('./types').BadgeProps} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, variant, size, rounded, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, rounded }), className)}
        {...props}
        ref={ref}
      />
    );
  },
);

Chip.displayName = "Chip";

export { Chip };
