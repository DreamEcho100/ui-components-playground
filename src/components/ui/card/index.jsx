import { forwardRef } from 'react';

import { cn } from '~/lib/utils';

/**
 * @template T
 * @typedef {import('react').HTMLAttributes<T>} HTMLAttributes
 */

const Card = forwardRef(
  /**
   * @param {import('./types').CardProps} props
   * @param {import('react').Ref<HTMLDivElement>} ref
   */
  ({ className, as: As = 'section', size, ...props }, ref) => (
    <As
      ref={ref}
      data-card-size={size}
      className={cn(
        'rounded-xl border border-solid bg-card text-card-foreground shadow-sm flex flex-col group',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLDivElement>} props
   * @param {import('react').Ref<HTMLDivElement>} ref
   */
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col',
        'group-[[data-card-size=sm]]:pt-4 group-[[data-card-size=sm]]:px-3 group-[[data-card-size=sm]]:gap-1.5',
        'group-[[data-card-size=md]]:pt-6 group-[[data-card-size=md]]:px-4 group-[[data-card-size=md]]:gap-2',
        'group-[[data-card-size=default]]:pt-8 group-[[data-card-size=default]]:px-6 group-[[data-card-size=default]]:gap-3',
        'group-[[data-card-size=lg]]:pt-10 group-[[data-card-size=lg]]:px-8 group-[[data-card-size=lg]]:gap-4',
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLHeadingElement>} props
   * @param {import('react').Ref<HTMLHeadingElement>} ref
   */
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLParagraphElement>} props
   * @param {import('react').Ref<HTMLParagraphElement>} ref
   */
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLDivElement>} props
   * @param {import('react').Ref<HTMLDivElement>} ref
   */
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'group-[[data-card-size=sm]]:p-3',
        'group-[[data-card-size=md]]:p-4',
        'group-[[data-card-size=default]]:p-6',
        'group-[[data-card-size=lg]]:p-8',
        className,
      )}
      {...props}
    />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLDivElement>} props
   * @param {import('react').Ref<HTMLDivElement>} ref
   */
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center pt-0',
        'group-[[data-card-size=sm]]:px-3 group-[[data-card-size=sm]]:pb-4',
        'group-[[data-card-size=md]]:px-4 group-[[data-card-size=md]]:pb-6',
        'group-[[data-card-size=default]]:px-6 group-[[data-card-size=default]]:pb-8',
        'group-[[data-card-size=lg]]:px-8 group-[[data-card-size=lg]]:pb-10',
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
