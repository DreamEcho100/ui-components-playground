/** @import { ForwardedRef } from 'react' */
/** @import { InputProps } from './types.ts' */

import { forwardRef } from "react";

import { cn } from "~/libs/utils";

const Input = forwardRef(
  /**
   * @param {InputProps} props
   * @param {ForwardedRef<HTMLInputElement>} ref
   */
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-solid border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
