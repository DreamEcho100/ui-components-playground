"use client";
/** @import { CardSize } from '~/components/ui/card/types.ts' */

import { Button } from "~/components/ui/button";
import ShowcaseArticle from "../article";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { useState } from "react";

const buttonSizes = /** @type {CardSize[]} */ ([
  null,
  "sm",
  "md",
  "default",
  "lg",
]);
export default function CardsShowCase() {
  const [size, setSize] = useState(/** @type {CardSize | null} */ (null));

  return (
    <ShowcaseArticle
      header={{
        title: "Cards",
        description:
          "Cards are used to group related information, it could a `section` or an `article` (you should choose the appropriate one based on the context, for example, if the card is a standalone component, you should use an `article`, if it is part of a layout, you should use a `section`).",
      }}
      sections={[
        {
          title: "Card",
          description: [
            "A card is a flexible and extensible content container and can include a header, footer, and body",
            "It also can be used to display a single piece of content or a collection of content",
            "If no size is provided, the card will inherit the parent's size, so it's recommended to always provide size at one of it's parents (for example, in `body` add `data-card-size='default` attribute and `group` class name).",
            "it comes in different sizes.",
          ],
          content: (
            <>
              <label className="flex flex-wrap items-center gap-1">
                <span>Select size:</span>
                <select
                  className="w-32 rounded-md border border-solid border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  value={size ?? "null"}
                  onChange={(e) => setSize(/** @type {any} */ (e.target.value))}
                >
                  {buttonSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <Card size={size}>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer nec odio. Praesent libero. Sed cursus ante dapibus
                    diam.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer nec odio. Praesent libero. Sed cursus ante dapibus
                    diam.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>
            </>
          ),
        },
      ]}
    />
  );
}
