'use client';
import { forwardRef } from 'react';

import { cn } from '~/lib/utils';
import { buttonVariants } from './utils';

const Button = forwardRef(
  /**
   * @param {import('./types').ButtonProps} props
   * @param {import('react').ForwardedRef<HTMLButtonElement>} ref
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
Button.displayName = 'Button';

export { Button };
