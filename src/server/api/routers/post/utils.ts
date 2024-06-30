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
          value: z.object({
            from: z.string().optional(),
            to: z.string().optional(),
          }),
        }),
        z.object({
          id: z.literal("createdAt"),
          value: z.object({
            from: z.string().optional(),
            to: z.string().optional(),
          }),
        }),
      ]),
    ),

    limit: z.number().min(1).max(100).nullish(),
    cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
  })
  .strict();

type Cursor = number | null | undefined;

export const handleCursorPageQuery = async <
  Input extends {
    limit?: number | null | undefined;
    cursor?: Cursor;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: { id: string; value: any }[];
    sorting: { id: string; desc: boolean }[];
  },
  Item extends { createdAt: number },
>(
  input: Input,
  getItems: (params: {
    input: Input;
    limit: number;
    take: number;
    createdAt?: { lte: NonNullable<Cursor> };
    defaultOrderBy: { createdAt: "desc" };
  }) => Promise<Item[]>,
  options: { defaultLimit: number } = { defaultLimit: 100 },
) => {
  const limit = input.limit ?? options.defaultLimit;

  const items = await getItems({
    input,
    limit,
    take: limit + 1,
    createdAt: input.cursor ? { lte: input.cursor } : undefined,
    defaultOrderBy: { createdAt: "desc" },
  });

  let nextCursor: Input["cursor"] = undefined;
  if (items.length > limit) {
    const nextItem = items.pop()!;
    nextCursor = nextItem.createdAt;
  }

  return { items, nextCursor };
};
