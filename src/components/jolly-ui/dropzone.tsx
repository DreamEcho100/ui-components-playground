"use client";

import * as React from "react";
import { DropZone, type DropZoneProps } from "react-aria-components";

import { cn } from "~/libs/utils";

const _DropZone = ({ className, ...props }: DropZoneProps) => (
  <DropZone
    className={(values) =>
      cn(
        "flex h-[150px] w-[300px] flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm data-[drop-target]:border-solid data-[drop-target]:border-primary data-[drop-target]:bg-accent",
        typeof className === "function" ? className(values) : className,
      )
    }
    {...props}
  />
);

export { _DropZone as DropZone };
