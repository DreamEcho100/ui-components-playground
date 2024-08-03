"use client";
/**
 * @import { ReactNode } from 'react'
 * @import { BreadcrumbBuilderProps } from './types'
 */

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../index";
import { useMemo } from "react";

/** @param {BreadcrumbBuilderProps} props */
export function BreadcrumbBuilder({
  pathname,
  excludeMap: excludeMap_,
  disableMap: disableMap_,
  disableFirstBreadcrumb: disableFirstBreadcrumb_,
  excludeRoot: excludeRoot_,
  formatRoot: formatRoot_,
  disableRoot: disableRoot_,
  disableLastBreadcrumb: disableLastBreadcrumb_,
  nameFormatMap: nameFormatMap_,
  nameMap: nameMap_,
  nameReplaceMap: nameReplaceMap_,
  nameReplace: nameReplace_,
  ...props
}) {
  const breadcrumbItems = useMemo(() => {
    const excludeMap = excludeMap_ ?? {};
    const disableMap = disableMap_ ?? {};
    const disableFirstBreadcrumb = disableFirstBreadcrumb_ ?? false;
    const disableLastBreadcrumb = disableLastBreadcrumb_ ?? false;

    const parts = pathname.split("/").filter((item) => {
      return !!item && !(item in excludeMap);
    });

    /** @type {ReactNode[]} */
    const breadcrumbItems = [];

    if (!excludeRoot_) {
      const rootName = !!formatRoot_
        ? typeof formatRoot_ === "function"
          ? formatRoot_("Home")
          : formatRoot_
        : "/";

      if (!disableRoot_) {
        breadcrumbItems.push(
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{rootName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>,
        );
      } else {
        breadcrumbItems.push(
          <BreadcrumbItem>
            <BreadcrumbPage>{rootName}</BreadcrumbPage>
          </BreadcrumbItem>,
        );
      }

      if (parts.length > 0) {
        breadcrumbItems.push(<BreadcrumbSeparator />);
      }
    }

    for (let i = 0; i < parts.length; i++) {
      const part = /** @type {string} */ (parts[i]);
      let name;

      if (nameFormatMap_ && part in nameFormatMap_) {
        name =
          /** @type {(name: string) => ReactNode} */ (nameFormatMap_[part])(
            part,
          ) ?? part;
      } else if (nameMap_ && part in nameMap_) {
        name = /** @type {ReactNode} */ (nameMap_[part]) ?? part;
      } else if (nameReplaceMap_ && part in nameReplaceMap_) {
        const nameReplace = nameReplaceMap_[part];

        if (nameReplace) {
          name = part.replace(nameReplace[0], nameReplace[1]);
        } else {
          name = part;
        }
      } else {
        if (nameReplace_) {
          name =
            part.replace(
              new RegExp(nameReplace_.pattern, nameReplace_.flags),
              nameReplace_.replaceValue,
            ) ?? part;
        } else {
          name = part;
        }
      }

      const href = `/${parts.slice(0, i + 1).join("/")}`;
      const disabled = part in disableMap;

      // /**
      //  * @type {{
      // *  name: string;
      // *  href: string;
      // *  disabled: boolean;
      // * }[]}
      // */
      breadcrumbItems.push(
        disabled ||
          (i === 0 && disableFirstBreadcrumb) ||
          (i === parts.length - 1 && disableLastBreadcrumb) ? (
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={href}>{name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ),
      );

      if (i < parts.length - 1) {
        breadcrumbItems.push(<BreadcrumbSeparator />);
      }
    }

    return breadcrumbItems;
  }, [
    excludeMap_,
    disableMap_,
    disableFirstBreadcrumb_,
    disableLastBreadcrumb_,
    pathname,
    excludeRoot_,
    formatRoot_,
    disableRoot_,
    nameFormatMap_,
    nameMap_,
    nameReplaceMap_,
    nameReplace_,
  ]);

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
    </Breadcrumb>
  );
}
