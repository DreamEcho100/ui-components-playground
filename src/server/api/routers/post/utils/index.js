import { TRPCError } from "@trpc/server";
import { z } from "zod";

// const defaultCursorName = "createdAt";
const maxSorting = 1;
export const getManyPostsSchema = z.object({
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
      z.object({
        id: z.enum(["createdAt", "updatedAt", "viewCount", "name", "status"]),
        desc: z.boolean(),
      }),
      // z.union([
      //   z.object({ id: z.literal("updatedAt"), desc: z.boolean() }),
      //   z.object({ id: z.literal("viewCount"), desc: z.boolean() }),
      //   z.object({ id: z.literal("name"), desc: z.boolean() }),
      //   z.object({ id: z.literal("status"), desc: z.boolean() }),
      // ]),
    )
    .max(maxSorting)
    .optional()
    .default([{ id: "createdAt", desc: true }]),
  limit: z.number().optional(),
  cursor: z.unknown().nullish().optional(),
  direction: z.enum(["forward", "backward"]).optional().default("forward"), // optional, useful for bi-directional query
});

/**
 * @typedef {z.infer<typeof getManyPostsSchema>} GetManyPostsActionInput
 **/

/**
 * @template {Record<string, any>} Input
 * @template R
 * @typedef {(where: { createAt?: { gte?: Date; lte?: Date }; }, input: Input) => R} SetupFilters
 */

/**
 * @param {{
 * 	sorting?: { id: string; desc: boolean; }[];
 * 	cursor?: unknown;
 * 	direction?: "forward" | "backward";
 * }} input
 * @param {{
 *  setupFilters: SetupFilters<any, Record<string, any>>
 *  defaultCursorName?: string;
 *  isMultiSorting?: boolean;
 * }} options
 */
function generateCursorPageQueryIndicators(input, options) {
  /** @type {Record<string, any>} */
  const where = {};
  /** @type {Record<string, any>} */
  const orderBy = {};

  let cursorBy;
  let cursorDirection;

  if (options.isMultiSorting) {
    throw new Error("Multi-sorting is not supported yet");
  } else {
    const sort = input.sorting?.[0];
    if (sort) {
      orderBy[sort.id] = sort.desc ? "desc" : "asc";
      cursorDirection = sort.desc ? "desc" : "asc";
    }

    switch (sort?.id) {
      case "createdAt":
        cursorBy = sort.id;
        break;
      default:
        cursorBy = options.defaultCursorName;
    }
  }

  /** @type {number | undefined} */
  let skip;
  switch (cursorBy) {
    case "createdAt": {
      // cursor pagination
      const schema = z.coerce.date().nullish().optional();

      const cursor = schema.safeParse(input.cursor);

      if (!cursor.success) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid cursor" });
      }

      if (cursor.data) {
        where[cursorBy] =
          cursorDirection === "asc"
            ? { gte: cursor.data }
            : { lte: cursor.data };
      }
      break;
    }

    default: {
      // offset pagination
      const schema = z.number().nullish().optional();
      const cursor = schema.safeParse(input.cursor);
      if (!cursor.success) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid cursor" });
      }

      skip = cursor.data ?? 0;
      break;
    }
  }

  return { skip, where: options.setupFilters(where, input), cursorBy, orderBy };
}

/**
 * @template {{ limit?: number | null | undefined; sorting?: { id: string; desc: boolean }[]; direction?: "forward" | "backward"; }} Input
 * @template {Record<string, unknown>} Item
 *
 * @param {{
 *  getItems: (params: {
 * 		input: Input;
 * 		limit: number;
 * 		take: number;
 * 		skip?: number;
 * 		where: Record<string, any>;
 * 		orderBy?: Record<string, any>;
 * 	}) => Promise<Item[]>;
 *  setupFilters: SetupFilters<Input, Record<string, any>>;
 * 	input: Input;
 * 	defaults?: { cursorName?: string; limit?: number; }
 *  isMultiSorting?: boolean;
 * }} options
 */
export const handleCursorPageQuery = async (options) => {
  const limit = options.input.limit ?? options?.defaults?.limit ?? 10;

  if (
    !options.isMultiSorting &&
    options.input.sorting &&
    options.input.sorting.length > 1
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Multi-sorting is not supported",
    });
  }

  const { skip, where, cursorBy, orderBy } = generateCursorPageQueryIndicators(
    options.input,
    {
      setupFilters: options.setupFilters,
      defaultCursorName: options.defaults?.cursorName,
      isMultiSorting: options.isMultiSorting,
    },
  );

  const items = await options.getItems({
    input: options.input,
    limit,
    take: limit + 1, // Fetch one extra record to check for prev/next pages
    skip,
    where,
    orderBy,
  });
  // .then((items) => {
  //   if (options.input.direction === "backward") {
  //     return items.reverse();
  //   }
  //   return items;
  // });

  // return options.resolveTo({ items, input: options.input, limit });

  switch (cursorBy) {
    case "createdAt": {
      // cursor pagination

      const lastItem = items.length > limit ? items.pop() : null;

      const nextCursor = /** @type {string|null} */ (
        lastItem ? lastItem[cursorBy] : null
      );
      const prevCursor = /** @type {string|null} */ (
        items[0]?.[cursorBy] ?? null
      );

      return { items, nextCursor, prevCursor };
    }

    default: {
      // offset pagination

      const lastItem = items.length > limit ? items.pop() : null;
      const nextCursor = lastItem ? limit + (skip ?? 0) : null;
      const prevCursor = skip ?? 0;

      return { items, nextCursor, prevCursor };
    }
  }
};
