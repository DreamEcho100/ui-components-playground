"use client";
/** @import { ButtonVariant } from '~/components/ui/button/types.ts' */

import { useState } from "react";
import { Button } from "~/components/ui/button";
import ShowcaseArticle from "../article";

const buttonThemes = /** @type {const} */ ([
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
  "success",
  "warning",
  "info",
  "dark",
  "light",
]);

const buttonSizes = /** @type {const} */ ([
  "default",
  "sm",
  "lg",
  "icon",
  "xl",
  "xs",
  null,
]);

export default function ButtonsShowSase() {
  const [size, setSize] = useState(
    /** @type {ButtonVariant['size'] | null} */ ("default"),
  );

  return (
    <ShowcaseArticle
      header={{
        title: "Buttons",
        description: "Buttons are used to perform actions.",
      }}
      sections={[
        {
          title: "Themes and Sizes",
          description: "Buttons come in different themes and sizes.",
          content: (
            <>
              <label className="flex flex-wrap items-center gap-1">
                <span>Select size:</span>
                <select
                  className="w-32 rounded-md border border-solid border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  value={size ?? ""}
                  onChange={(e) => setSize(/** @type {any} */ (e.target.value))}
                >
                  {buttonSizes.map((size) => (
                    <option key={size ?? "none"} value={size ?? "none"}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap gap-4">
                {buttonThemes.map((theme) => (
                  <Button key={theme} variant={theme} size={size}>
                    {theme}
                  </Button>
                ))}
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
