import { cva } from 'class-variance-authority';

// data-[hovered=true]
// data-[pressed=true]
// data-[focus-visible=true]

const defaultOnPress =
  'data-[pressed=true]:bg-opacity-100 data-[pressed=true]:text-opacity-90 data-[pressed=true]:backdrop-brightness-90';
const defaultOnPress2 =
  'data-[pressed=true]:bg-opacity-100 data-[pressed=true]:text-opacity-80 data-[pressed=true]:backdrop-brightness-90';
const defaultOnPress3 = 'data-[pressed=true]:text-opacity-80';

export const buttonVariants = cva(
  [
    'transition-colors duration-75 ease-in',
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[focus-visible=true]:outline-transparent data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-offset-2 data-[focus-visible=true]:ring-ring data-[focus-visible=true]:ring-opacity-70',
    'focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-opacity-70',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'data-[hovered=true]:bg-opacity-85',
          'hover:bg-opacity-85',
          `${defaultOnPress} data-[pressed=true]:ring-opacity-50`,
        ],
        destructive: [
          'bg-destructive text-destructive-foreground',
          'data-[hovered=true]:bg-opacity-85',
          'hover:bg-opacity-85',
          `${defaultOnPress} data-[pressed=true]:ring-opacity-50`,
        ],
        outline: [
          'border border-solid border-input bg-background',
          'data-[hovered=true]:bg-accent data-[hovered=true]:text-accent-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          `${defaultOnPress2} data-[pressed=true]:ring-opacity-50`,
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'data-[hovered=true]:bg-opacity-75',
          'hover:bg-opacity-75',
          `${defaultOnPress2} data-[pressed=true]:ring-opacity-50`,
        ],
        ghost: [
          'data-[hovered=true]:bg-accent data-[hovered=true]:text-accent-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          `${defaultOnPress2} data-[pressed=true]:ring-opacity-50`,
        ],
        link: [
          'text-primary underline-offset-4',
          'data-[hovered=true]:underline',
          'hover:underline',
          `${defaultOnPress3} data-[pressed=true]:ring-opacity-50`,
        ],
        success: [
          'bg-success text-success-foreground',
          'data-[hovered=true]:bg-opacity-85',
          'hover:bg-opacity-85',
          `${defaultOnPress} data-[pressed=true]:ring-opacity-50`,
        ],
        warning: [
          'bg-warning text-warning-foreground',
          'data-[hovered=true]:bg-opacity-85',
          'hover:bg-opacity-85',
          `${defaultOnPress2} data-[pressed=true]:ring-opacity-50`,
        ],
        info: [
          'bg-info text-info-foreground',
          'data-[hovered=true]:bg-opacity-85',
          'hover:bg-opacity-85',
          `${defaultOnPress} data-[pressed=true]:ring-opacity-50`,
        ],
        dark: [
          'bg-dark text-dark-foreground',
          'data-[hovered=true]:bg-opacity-85',
          'hover:bg-opacity-85',
          `${defaultOnPress} data-[pressed=true]:ring-opacity-50`,
        ],
        light: [
          'bg-light text-light-foreground',
          'data-[hovered=true]:bg-opacity-85',
          'hover:bg-opacity-85',
          `${defaultOnPress2} data-[pressed=true]:ring-opacity-50`,
        ],
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        // Additional sizes
        xl: 'h-12 rounded-md px-10',
        xs: 'h-8 rounded-md px-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
