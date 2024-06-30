import { z } from "zod";

export const getManyPostsSchema = z
  .object({
    sorting: z.array(
      z.object({
        id: z.enum(["createdAt", "updatedAt", "name"]),
        desc: z.boolean(),
      }),
    ),
    filters: z.array(
      z.union([
        z.object({
          id: z.literal("name"),
          value: z.string(),
        }),
        z.object({
          id: z.literal("createdAt"),
          value: z.tuple([
            z.string().nullish(), // from
            z.string().nullish(), // to
          ]),
        }),
        z.object({
          id: z.literal("updatedAt"),
          value: z.tuple([
            z.string().nullish(), // from
            z.string().nullish(), // to
          ]),
        }),
      ]),
    ),
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.date().optional().or(z.string().optional()), // Represents a timestamp string
    direction: z.enum(["forward", "backward"]).optional(), // Useful for bi-directional query
  })
  .strict();

type Cursor = z.infer<typeof getManyPostsSchema>["cursor"];

export const handleCursorPageQuery = async <
  Input extends {
    limit?: number | null | undefined;
    cursor?: Cursor;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: { id: string; value: any }[];
    sorting: { id: string; desc: boolean }[];
    direction?: "forward" | "backward";
  },
  Item extends { createdAt: NonNullable<Cursor> },
>(
  input: Input,
  getItems: (params: {
    input: Input;
    limit: number;
    take: number;
    createdAt?: { lte?: Date; gte?: Date };
    defaultOrderBy: { createdAt: "desc" | "asc" };
  }) => Promise<Item[]>,
  options: { defaultLimit: number } = { defaultLimit: 100 },
) => {
  const limit = input.limit ?? options.defaultLimit;

  let cursor: Date | undefined;
  if (input.cursor) {
    cursor =
      typeof input.cursor === "string" ? new Date(input.cursor) : input.cursor;

    if (isNaN(cursor.getTime())) {
      throw new Error("Invalid cursor");
    }
  }

  const whereClause: { createdAt?: { lte?: Date; gte?: Date } } = {};
  if (input.cursor) {
    whereClause.createdAt =
      input.direction === "forward" ? { lte: cursor } : { gte: cursor };
  }

  const items = await getItems({
    input,
    limit,
    take: limit + 1, // Fetch one extra record to check for prev/next pages
    ...whereClause,
    defaultOrderBy: {
      createdAt: input.direction === "forward" ? "desc" : "asc",
    },
  });

  let nextCursor: Input["cursor"] = undefined;
  let prevCursor: Input["cursor"] = undefined;

  if (input.direction === "forward") {
    if (items.length > limit) {
      nextCursor = items.pop()!.createdAt;
    }
    prevCursor = items.length > 0 ? items[0]!.createdAt : cursor;
  } else {
    if (items.length > limit) {
      prevCursor = items.pop()!.createdAt;
    }
    nextCursor = items.length > 0 ? items[0]!.createdAt : cursor;
  }

  return { items, nextCursor, prevCursor };
};
