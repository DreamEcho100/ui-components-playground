"use client";
/** @import { BreadcrumbAutoProps } from './types.ts' */

import { usePathname } from "next/navigation";
import { BreadcrumbBuilder } from "../builder/index.jsx";

/** @param {BreadcrumbAutoProps} props */
export function BreadcrumbAuto(props) {
  const pathname = usePathname();

  return <BreadcrumbBuilder {...props} pathname={pathname} />;
}
