import type { HTMLAttributes } from '.';

export type CardSize = 'sm' | 'md' | 'default' | 'lg';
export type CardEdge = 'rounded' | 'border' | 'shadow';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'section' | 'article' | 'div';
  edges?: CardEdge | CardEdge[] | null;
  size?: CardSize | null;
}
