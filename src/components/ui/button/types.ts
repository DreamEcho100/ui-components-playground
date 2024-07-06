import type { VariantProps } from "class-variance-authority";

// import type{
//   PressEvent,
//   ButtonProps as RACButtonProps,
// } from 'react-aria-components';
import type { buttonVariants } from "./utils";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariant {}
