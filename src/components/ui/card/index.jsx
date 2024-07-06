/** @import { HTMLAttributes, Ref } from 'react' */
/** @import { CardProps } from './types' */

import { forwardRef } from "react";

import { cn } from "~/lib/utils";

const cardEdgesMap = {
  none: "",
  rounded: "rounded-xl",
  border: "border border-solid border-border",
  shadow: "shadow-sm",
};

/**
 * @template T
 * @typedef {HTMLAttributes<T>} HTMLAttributes
 */

const Card = forwardRef(
  /**
   * @param {CardProps} props
   * @param {Ref<HTMLDivElement>} ref
   */
  ({ className, as: As = "div", size, edges, ...props }, ref) => (
    <As
      ref={ref}
      data-card-size={size}
      className={cn(
        "group flex flex-col bg-card text-card-foreground",
        typeof edges === "string"
          ? cardEdgesMap[edges]
          : Array.isArray(edges)
            ? edges.map((edge) => cardEdgesMap[edge]).join(" ")
            : typeof edges === "object"
              ? ""
              : `${cardEdgesMap.rounded} ${cardEdgesMap.border} ${cardEdgesMap.shadow}`,
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLDivElement>} props
   * @param {Ref<HTMLDivElement>} ref
   */
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col",
        "group-[[data-card-size=sm]]:gap-1.5 group-[[data-card-size=sm]]:px-3 group-[[data-card-size=sm]]:pt-4",
        "group-[[data-card-size=md]]:gap-2 group-[[data-card-size=md]]:px-4 group-[[data-card-size=md]]:pt-6",
        "group-[[data-card-size=default]]:gap-2 group-[[data-card-size=default]]:px-6 group-[[data-card-size=default]]:pt-8",
        "group-[[data-card-size=lg]]:gap-3 group-[[data-card-size=lg]]:px-8 group-[[data-card-size=lg]]:pt-10",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLHeadingElement> & {
   * 	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
   * }} props
   * @param {Ref<HTMLHeadingElement>} ref
   */
  ({ className, as: As = "h3", ...props }, ref) => (
    <As
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLParagraphElement>} props
   * @param {Ref<HTMLParagraphElement>} ref
   */
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLDivElement> & {
   *  size?: 'none' | 'sm' | 'md' | 'default' | 'lg'
   * }} props
   * @param {Ref<HTMLDivElement>} ref
   */
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        size
          ? {
              none: "",
              sm: "p-3",
              md: "p-4",
              default: "p-6",
              lg: "p-8",
            }[size]
          : [
              "group-[[data-card-size=none]]:p-0",
              "group-[[data-card-size=sm]]:p-3",
              "group-[[data-card-size=md]]:p-4",
              "group-[[data-card-size=default]]:p-6",
              "group-[[data-card-size=lg]]:p-8",
            ],
        className,
      )}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(
  /**
   * @param {HTMLAttributes<HTMLDivElement> & {
   *  size?: 'none' | 'sm' | 'md' | 'default' | 'lg'
   * }} props
   * @param {Ref<HTMLDivElement>} ref
   */
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center pt-0",

        size
          ? {
              none: "",
              sm: "px-3 pb-4",
              md: "px-4 pb-6",
              default: "px-6 pb-8",
              lg: "px-8 pb-10",
            }[size]
          : [
              "group-[[data-card-size=sm]]:px-3 group-[[data-card-size=sm]]:pb-4",
              "group-[[data-card-size=md]]:px-4 group-[[data-card-size=md]]:pb-6",
              "group-[[data-card-size=default]]:px-6 group-[[data-card-size=default]]:pb-8",
              "group-[[data-card-size=lg]]:px-8 group-[[data-card-size=lg]]:pb-10",
            ],
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
