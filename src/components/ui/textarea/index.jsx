/** @import { ForwardedRef } from 'react' */
/** @import { TextareaProps } from './types.ts' */

import { forwardRef } from "react";

import { cn } from "~/lib/utils";

const Textarea = forwardRef(
  /**
   * @param {TextareaProps} props
   * @param {ForwardedRef<HTMLTextAreaElement>} ref
   */
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[5rem] w-full rounded-md border border-solid border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
