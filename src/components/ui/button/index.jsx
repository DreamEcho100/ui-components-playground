"use client";
/** @import { ForwardedRef } from 'react' */
/** @import { ButtonProps } from './types.ts' */

import { forwardRef } from "react";
import { cn } from "~/libs/utils";
import { buttonVariants } from "./utils";

const Button = forwardRef(
  /**
   * @param {ButtonProps} props
   * @param {ForwardedRef<HTMLButtonElement>} ref
   */
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        type="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
