"use client";
/** @import { ReactNode, ForwardedRef, ElementRef } from 'react' */
/** @import { SelectTriggerProps, SelectScrollUpButtonProps, SelectScrollDownButtonProps, SelectContentProps, SelectLabelProps, SelectItemProps, SelectSeparatorProps } from '@radix-ui/react-select' */

import { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "~/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = forwardRef(
  /**
   * @param {SelectTriggerProps} props
   * @param {ForwardedRef<ElementRef<typeof SelectPrimitive.Trigger>>} ref
   */
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-solid border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = forwardRef(
  /**
   * @param {SelectScrollUpButtonProps} props
   * @param {ForwardedRef<ElementRef<typeof SelectPrimitive.ScrollUpButton>>} ref
   */
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  ),
);
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = forwardRef(
  /**
   * @param {SelectScrollDownButtonProps} props
   * @param {ForwardedRef<ElementRef<typeof SelectPrimitive.ScrollDownButton>>} ref
   */
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  ),
);
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = forwardRef(
  /**
   * @param {SelectContentProps} props
   * @param {ForwardedRef<ElementRef<typeof SelectPrimitive.Content>>} ref
   */
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-solid bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            // 'p-1',
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = forwardRef(
  /**
   * @param {SelectLabelProps} props
   * @param {ForwardedRef<ElementRef<typeof SelectPrimitive.Label>>} ref
   */
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Label
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
      {...props}
    />
  ),
);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = forwardRef(
  /**
   * @param {SelectItemProps} props
   * @param {ForwardedRef<ElementRef<typeof SelectPrimitive.Item>>} ref
   */
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex h-10 w-full cursor-default select-none items-center rounded-sm px-3 py-2 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ),
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = forwardRef(
  /**
   * @param {SelectSeparatorProps} props
   * @param {ForwardedRef<ElementRef<typeof SelectPrimitive.Separator>>} ref
   */
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  ),
);
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const SelectDropdown = forwardRef(
  /**
   * @typedef Option
   *
   * @param {SelectTriggerProps & {
   * 	placeholder?: string;
   *  options: { value: Option; label: ReactNode }[];
   *  value?: Option | null;
   *  onValueChange?: import('@radix-ui/react-select').SelectProps['onValueChange']
   * }} props
   * @param {ForwardedRef<ElementRef<typeof SelectPrimitive.Trigger>>} ref
   */
  ({ placeholder, options, value, onValueChange, ...props }, ref) => {
    return (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger {...props} ref={ref}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((item) => (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
);

SelectDropdown.displayName = "SelectDropdown";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectDropdown,
};
