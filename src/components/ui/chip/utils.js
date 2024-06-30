import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-solid px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-foreground',
        success:
          'border-transparent bg-success text-success-foreground hover:bg-success/80',
        warning:
          'border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
        ghost:
          'border-transparent bg-background text-accent-foreground hover:bg-accent/80',
        link: 'border-transparent text-primary underline-offset-4 hover:underline',
        info: 'border-transparent bg-info text-info-foreground hover:bg-info/80',
        dark: 'border-transparent bg-dark text-dark-foreground hover:bg-dark/80',
        light:
          'border-transparent bg-light text-light-foreground hover:bg-light/80',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      },
      rounded: {
        md: 'rounded-md',
        square: 'rounded-none',
        pill: 'rounded-full',
      },
      state: {
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'pill',
    },
  },
);
