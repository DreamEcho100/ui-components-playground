import { cva } from 'class-variance-authority';
import { cn } from '~/lib/utils';

const horizontalBoxSeparator = cva('', {
  variants: {
    h: {
      '4/5': 'h-4/5 my-[1.25%]',
      full: 'h-full',
    },
  },
  defaultVariants: {
    h: '4/5',
  },
});

/**
 * @param {{
 * 	start?: import('react').ReactNode;
 * 	startSeparator?: boolean;
 * 	end?: import('react').ReactNode;
 * 	endSeparator?: boolean;
 * 	children: import('react').ReactNode;
 *  className?: string;
 * }} props
 */
export default function HorizontalBox(props) {
  return (
    <div
      className={cn(
        props.className,
        'flex border border-solid border-input rounded-md items-stretch overflow-hidden',
        props.start && 'ps-2.5',
        props.end && 'pe-2.5',
      )}
    >
      {props.start}
      {props.start && props.startSeparator && (
        <div
          className={cn(
            'border border-solid bg-input w-2 h-full flex-shrink-0',
            horizontalBoxSeparator(),
          )}
        />
      )}
      {props.children}
      {props.end && props.endSeparator && (
        <div
          className={cn(
            'border border-solid bg-input w-2 h-full flex-shrink-0',
            horizontalBoxSeparator(),
          )}
        />
      )}
      {props.end}
    </div>
  );
}
