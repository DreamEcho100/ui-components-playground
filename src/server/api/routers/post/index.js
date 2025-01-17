/** @import { Prisma } from "@prisma/client" */

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { handleCursorPageQuery } from "../../../utils/handle-cursor-page-query";
import { z } from "zod";
import { posts } from "~/server/db/schema";
import { getManyPostsSchema } from "~/libs/schemas/get-many-posts";

export const postRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(getManyPostsSchema)
    .query(async ({ ctx, input }) => {
      return await handleCursorPageQuery({
        input,
        setupFilters: (_where, input) => {
          /** @type {Prisma.PostWhereInput & { AND: any[] }} */
          const where = { ..._where, AND: [] };

          if (input.filters) {
            for (const filter of input.filters) {
              switch (filter.id) {
                case "name": {
                  where.AND.push({ [filter.id]: { contains: filter.value } });
                  break;
                }

                case "status": {
                  where.AND.push({ [filter.id]: filter.value });
                  break;
                }

                case "viewCount": {
                  where.AND.push({
                    [filter.id]: {
                      gte: filter.value[0] ?? undefined,
                      lte: filter.value[1] ?? undefined,
                    },
                  });
                  break;
                }

                case "createdAt":
                case "updatedAt": {
                  where.AND.push({
                    [filter.id]: {
                      gte: filter.value[0] ?? undefined,
                      lte: filter.value[1] ?? undefined,
                    },
                  });
                  break;
                }
              }
            }
          }

          return where;
        },
        getItems: async ({ take, skip, orderBy, where }) => {
          return ctx.prisma.post.findMany({ take, orderBy, where, skip });
        },
        // defaults: { cursorName: "createdAt" },
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

      await ctx.prisma.post.createMany({ data: input });
    }),

  createMany: publicProcedure
    .input(z.object({ items: z.array(z.object({ name: z.string() })) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values(input.items);
    }),

  deleteMany: publicProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.deleteMany({
        where: { id: { in: input.ids } },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),
});
