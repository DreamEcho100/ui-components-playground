import type { HTMLAttributes } from '.';

export type CardSize = 'sm' | 'md' | 'default' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	as?: 'section' | 'article';
	size?: CardSize | null;
}
