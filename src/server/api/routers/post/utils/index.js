import { z } from "zod";

const createdAtCursor = z.object({
  cursorBy: z.literal("createdAt"),
  cursor: z.coerce.date().nullish().optional(),
});
const updatedAtCursor = z.object({
  cursorBy: z.literal("updatedAt"),
  cursor: z.coerce.date().nullish().optional(),
});
const viewCountCursor = z.object({
  cursorBy: z.literal("viewCount"),
  cursor: z.number().nullish().optional(),
});

const base = z.object({
  filters: z.array(
    z.union([
      z.object({
        id: z.literal("status"),
        value: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
      }),
      z.object({
        id: z.literal("name"),
        value: z.string(),
      }),
      z.object({
        id: z.literal("createdAt"),
        value: z.tuple([
          z.string().nullish().optional(), // from
          z.string().nullish().optional(), // to
        ]),
      }),
      z.object({
        id: z.literal("viewCount"),
        value: z.tuple([
          z.number().nullish().optional(), // from
          z.number().nullish().optional(), // to
        ]),
      }),
      z.object({
        id: z.literal("updatedAt"),
        value: z.tuple([
          z.string().nullish().optional(), // from
          z.string().nullish().optional(), // to
        ]),
      }),
    ]),
  ),
  sorting: z
    .array(
      z.union([
        z.object({ id: z.literal("createdAt"), desc: z.boolean() }),
        z.object({ id: z.literal("updatedAt"), desc: z.boolean() }),
        z.object({ id: z.literal("viewCount"), desc: z.boolean() }),
        z.object({ id: z.literal("name"), desc: z.boolean() }),
        z.object({ id: z.literal("status"), desc: z.boolean() }),
      ]),
    )
    .min(1)
    .optional()
    .default([{ id: "createdAt", desc: true }]),
  limit: z.number().optional(),
  direction: z.enum(["forward", "backward"]).optional().default("forward"), // optional, useful for bi-directional query
});

export const getManyPostsSchema = z.discriminatedUnion("cursorBy", [
  createdAtCursor.merge(base).strict(),
  updatedAtCursor.merge(base).strict(),
  viewCountCursor.merge(base).strict(),
]);

/**
 * @template {{ limit?: number | null | undefined; direction?: "forward" | "backward"; }} Input
 * @template {Record<string, unknown>} Item
 * @template {{ nextCursor: any; prevCursor: any; items: Item[]; }} ResolvedTo
 *
 * @param {{
 *  getItems: (params: { input: Input; limit: number; take: number; }) => Promise<Item[]>;
 * 	input: Input;
 * 	defaultLimit?: number;
 * 	resolveTo: (options: { items: Item[]; input: Input; limit: number; }) => ResolvedTo;
 * }} options
 */
{
}

/** @type {import("./types").handleCursorPageQuery} */
export const handleCursorPageQuery = async (options) => {
  const limit = options.input.limit ?? options?.defaultLimit ?? 10;

  const items = await options.getItems({
    input: options.input,
    limit,
    take: limit + 1, // Fetch one extra record to check for prev/next pages
  });
  // .then((items) => {
  //   if (options.input.direction === "backward") {
  //     return items.reverse();
  //   }
  //   return items;
  // });

  return options.resolveTo({ items, input: options.input, limit });
};
