import { cva } from "class-variance-authority";
import { useMemo } from "react";
import { cn } from "~/libs/utils";

const horizontalBoxSeparator = cva("", {
  variants: {
    h: {
      "4/5": "h-4/5 self-center",
      full: "h-full",
    },
  },
  defaultVariants: {
    h: "4/5",
  },
});

/**
 * HorizontalContainer component for aligning elements horizontally with optional separators.
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
  const firstColumn = props.start ? "auto" : false;
  const secondColumn = props.startSeparator ? "auto" : false;
  const fourthColumn = props.endSeparator ? "auto" : false;
  const fifthColumn = props.end ? "auto" : false;

  const gridTemplateColumns = useMemo(() => {
    return [firstColumn, secondColumn, "1fr", fourthColumn, fifthColumn]
      .filter(Boolean)
      .join(" ");
  }, [fifthColumn, firstColumn, fourthColumn, secondColumn]);

  const border = "border border-solid border-input";

  return (
    <div
      className={cn(
        "grid items-center overflow-hidden rounded-md",
        border,
        props.className,
      )}
      style={{ gridTemplateColumns }}
    >
      {props.start}
      {props.start && props.startSeparator && (
        <div
          className={cn(
            "h-full flex-shrink-0 flex-grow self-center bg-input",
            border,
            horizontalBoxSeparator(),
          )}
        />
      )}
      {props.children}
      {props.end && props.endSeparator && (
        <div
          className={cn(
            "h-full flex-shrink-0 flex-grow self-center",
            border,
            horizontalBoxSeparator(),
          )}
        />
      )}
      {props.end}
    </div>
  );
}
