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
