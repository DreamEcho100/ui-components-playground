/** @import { Prisma } from "@prisma/client" */

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getManyPostsSchema, handleCursorPageQuery } from "./utils";
import { z } from "zod";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(getManyPostsSchema)
    .query(async ({ ctx, input }) => {
      return await handleCursorPageQuery({
        input,
        getItems: async ({ input, take }) => {
          /** @type {Prisma.PostWhereInput & { AND: any[] }} */
          const where = {
            AND: [],
          };

          let stopCursor = false;
          if (input.filters) {
            for (const filter of input.filters) {
              switch (filter.id) {
                case "name": {
                  where.AND.push({ name: { contains: filter.value } });
                  break;
                }

                case "status": {
                  where.AND.push({
                    status: filter.value,
                  });
                  break;
                }

                case "viewCount": {
                  stopCursor = true;

                  const [from, to] = filter.value ?? {};
                  where.AND.push({
                    viewCount: {
                      gte: from ? Number(from) : undefined,
                      lte: to ? Number(to) : undefined,
                    },
                  });
                  break;
                }

                case "createdAt":
                case "updatedAt": {
                  stopCursor = true;

                  where.AND.push({
                    [filter.id]: {
                      gte: filter.value[0]
                        ? new Date(filter.value[0])
                        : undefined,
                      lte: filter.value[1]
                        ? new Date(filter.value[1])
                        : undefined,
                    },
                  });
                  break;
                }
              }
            }
          }

          if (!stopCursor) {
            switch (input.cursorBy) {
              case "viewCount": {
                if (input.cursor) {
                  where[input.cursorBy] = {
                    [input.direction === "forward" ? "gt" : "lt"]: input.cursor,
                  };
                }
                break;
              }

              case "createdAt":
              case "updatedAt": {
                if (input.cursor) {
                  where[input.cursorBy] =
                    input.direction === "forward"
                      ? { gt: new Date(input.cursor) }
                      : { lt: new Date(input.cursor) };
                }
                break;
              }
            }
          }

          /** @type {Prisma.PostOrderByWithRelationInput} */
          const orderBy = {};
          if (input.sorting) {
            for (const sort of input.sorting) {
              orderBy[sort.id] = sort.desc ? "desc" : "asc";
            }
          }

          return ctx.prisma.post.findMany({ take, orderBy, where });
        },
        resolveTo: ({ items, input, limit }) => {
          const lastItem = items.length < limit ? null : items.pop();
          const nextCursor = lastItem ? lastItem[input.cursorBy] : null;
          const prevCursor = items[0]?.[input.cursorBy] ?? null;

          return { items, nextCursor, prevCursor };
        },
      });
    }),

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),
});
