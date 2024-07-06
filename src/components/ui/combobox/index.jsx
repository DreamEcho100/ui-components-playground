"use client";
/** @import { ReactNode, Key } from 'react'*/
/** @import { ComboboxProps } from './types.ts'*/

import { useEffect, useRef, useState } from "react";
import { CommandList } from "cmdk";
import { CheckIcon, ChevronDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { commandItemDefaultClassName } from "../command/utils";
import { Button } from "../button";

/**
 * @template Option
 * @param {ComboboxProps<Option>} props
 */
export function Combobox(props) {
  const internalOpenStateControl = useState(false);
  const [open, setOpen] = props.openStateControl ?? internalOpenStateControl;

  const buttonRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const popoverContentRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  const query = props.externalQuery?.[0];
  const setQuery = props.externalQuery?.[1];

  const displayValue = /** @type {ReactNode} */ (
    typeof props.getDisplay === "function"
      ? props.getDisplay(props.value)
      : props.value ?? "Select ..."
  );

  const commandInputRef = useRef(/** @type {HTMLInputElement | null} */ (null));

  const configRef = useRef(
    /** @type {{ queryTimeoutId?: NodeJS.Timeout; buttonResizeObserver?: ResizeObserver; }} */ ({
      queryTimeoutId: undefined,
      buttonResizeObserver: undefined,
    }),
  );

  useEffect(() => {
    const config = configRef.current;

    if (!buttonRef.current) return;

    config.buttonResizeObserver = new ResizeObserver(() => {
      if (!buttonRef.current) return;
      popoverContentRef.current?.style.setProperty(
        "width",
        `${buttonRef.current.offsetWidth}px`,
      );
    });
    config.buttonResizeObserver.observe(buttonRef.current);

    return () => {
      if (config.buttonResizeObserver) {
        config.buttonResizeObserver.disconnect();
      }
    };
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onClick={(event) => {
          if (props.disabled) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <Button
          type="button"
          role="combobox"
          aria-describedby={props["aria-describedby"]}
          name={props.name}
          variant="outline"
          className="w-full justify-between border-input"
          ref={buttonRef}
          id={props.controlId}
          disabled={!!props.disabled}
        >
          <span className="flex flex-grow flex-wrap items-center justify-start">
            {displayValue}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ width: buttonRef.current?.offsetWidth }}
        ref={popoverContentRef}
      >
        <Command>
          <CommandInput
            ref={(node) => {
              if (!!commandInputRef.current || !node) {
                return;
              }

              node.value = query ?? "";
              commandInputRef.current = node;
            }}
            placeholder="Search..."
            className="h-9"
            onInput={
              setQuery
                ? (event) => {
                    const value = event.currentTarget.value;
                    clearInterval(configRef.current.queryTimeoutId);
                    configRef.current.queryTimeoutId = setTimeout(() => {
                      setQuery(value);
                    }, props.debounceTime);
                  }
                : undefined
            }
            disabled={!!props.disabled}
          />
          <CommandGroup>
            <CommandList>
              {props.data.map((option) => {
                const label =
                  typeof props.getOptionLabel === "function"
                    ? props.getOptionLabel(option)
                    : option + "";

                return (
                  <CommandItem
                    key={
                      /** @type {Key} */ (
                        typeof props.getOptionKey === "function"
                          ? props.getOptionKey(option)
                          : option
                      )
                    }
                    value={label}
                    onSelect={(currentQuery) => {
                      if (!commandInputRef.current) return;

                      if (
                        currentQuery.toLowerCase() ===
                        commandInputRef.current?.value.toLowerCase()
                      ) {
                        commandInputRef.current.value = "";
                        // props.setSelected(undefined);
                        props.handleClearOnReselect?.(option, props.onChange);
                      } else {
                        commandInputRef.current.value = label;
                        props.onChange(option);
                      }

                      setOpen(false);
                    }}
                  >
                    {label ?? "Select"}
                    <CheckIcon
                      className={cn(
                        "mr-auto h-4 w-4",
                        commandInputRef.current?.value.toLowerCase() ===
                          label.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandList>
          </CommandGroup>
          {props.isLoading ? (
            <p className={commandItemDefaultClassName}>Loading...</p>
          ) : (
            <CommandEmpty>Nothing found.</CommandEmpty>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
