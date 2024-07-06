/** @import { ForwardedRef } from 'react' */
/** @import { BadgeProps } from './types.ts' */

import { cn } from "~/lib/utils";
import { badgeVariants } from "./utils";
import { forwardRef } from "react";

const Chip = forwardRef(
  /**
   * @param {BadgeProps} props
   * @param {ForwardedRef<HTMLDivElement>} ref
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
