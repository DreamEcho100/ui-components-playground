import { VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from '../card';
import { badgeVariants } from './utils';

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
