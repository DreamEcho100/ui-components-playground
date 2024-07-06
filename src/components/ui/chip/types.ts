import type { VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "../card";
import type { badgeVariants } from "./utils";

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
