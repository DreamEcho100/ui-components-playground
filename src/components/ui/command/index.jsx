'use client';

import { forwardRef } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import { commandItemDefaultClassName } from './utils';

const Command = forwardRef(
  /**
   * @param {import('react').ComponentPropsWithoutRef<typeof CommandPrimitive>} props
   * @param {import('react').ForwardedRef<import('react').ElementRef<typeof CommandPrimitive>>} ref
   */
  ({ className, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        className,
      )}
      {...props}
    />
  ),
);
Command.displayName = CommandPrimitive.displayName;

/** @param {import('./types').CommandDialogProps} props  */
const CommandDialog = ({ children, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = forwardRef(
  /**
   * @param {import('react').ComponentPropsWithoutRef<typeof CommandPrimitive.Input>} props
   * @param {import('react').ForwardedRef<import('react').ElementRef<typeof CommandPrimitive.Input>>} ref
   */
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  ),
);

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = forwardRef(
  /**
   * @param {import('react').ComponentPropsWithoutRef<typeof CommandPrimitive.List>} props
   * @param {import('react').ForwardedRef<import('react').ElementRef<typeof CommandPrimitive.List>} ref
   */
  ({ className, ...props }, ref) => (
    <CommandPrimitive.List
      ref={ref}
      className={cn(
        'max-h-[300px] overflow-y-auto overflow-x-hidden',
        className,
      )}
      {...props}
    />
  ),
);

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = forwardRef(
  /**
   * @param {import('react').ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  (props, ref) => (
    <CommandPrimitive.Empty
      ref={ref}
      className="py-6 text-center text-sm"
      {...props}
    />
  ),
);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = forwardRef(
  /**
   * @param {import('react').ComponentPropsWithoutRef<typeof CommandPrimitive.Group>} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
);

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = forwardRef(
  /**
   * @param {import('react').ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 h-px bg-border', className)}
      {...props}
    />
  ),
);
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = forwardRef(
  /**
   * @param {import('react').ComponentPropsWithoutRef<typeof CommandPrimitive.Item>} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(commandItemDefaultClassName, className)}
      {...props}
    />
  ),
);

CommandItem.displayName = CommandPrimitive.Item.displayName;

/**
 * @param {import('react').ComponentPropsWithoutRef<'span'>} props
 */
const CommandShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
