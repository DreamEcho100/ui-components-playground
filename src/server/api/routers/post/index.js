import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import { getManyPostsSchema, handleCursorPageQuery } from "./utils";
import { Prisma } from "@prisma/client";

export const postRouter = createTRPCRouter({
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

  getMany: publicProcedure
    .input(getManyPostsSchema)
    .query(async ({ ctx, input }) => {
      // return ctx.db.query.posts.findMany();
      // return ctx.prisma.post.findMany();
      // return await handleCursorPageQuery(input, (params) =>
      //   ctx.prisma.post.findMany({
      //     take: params.take,
      //     orderBy: params.defaultOrderBy,
      //     where: {
      //       createdAt: params.createdAt,
      //     },
      //   }),
      // );
      return await handleCursorPageQuery(input, async (params) => {
        /**
         * @typedef {string | number | boolean | null | undefined | Date} BaseTypes
         */

        /** @type {Prisma.PostWhereInput} */
        const where = {
          createdAt: params.createdAt,
        };

        if (input.filters) {
          for (const filter of input.filters) {
            switch (filter.id) {
              case "name": {
                const item =
                  /** @type {Exclude<typeof where.name,BaseTypes>} */ (
                    where.name ??= {}
                  );
                item.contains = filter.value;
                break;
              }

              case "createdAt": {
                const item =
                  /** @type {Exclude<typeof where.createdAt,BaseTypes>} */ (
                    where.createdAt ??= {}
                  );
                item.gte = filter.value[0]
                  ? new Date(filter.value[0])
                  : undefined;
                item.lte = filter.value[1]
                  ? new Date(filter.value[1])
                  : undefined;
                break;
              }

              case "updatedAt": {
                const item =
                  /** @type {Exclude<typeof where.updatedAt,BaseTypes>} */ (
                    where.updatedAt ??= {}
                  );
                item.gte = filter.value[0]
                  ? new Date(filter.value[0])
                  : undefined;
                item.lte = filter.value[1]
                  ? new Date(filter.value[1])
                  : undefined;
                break;
              }
            }
          }
        }

        /** @type {Prisma.PostOrderByWithRelationInput} */
        const orderBy = params.defaultOrderBy;

        if (input.sorting) {
          for (const sort of input.sorting) {
            // if (sort.id === "createdAt") {
            // 	throw new Error("Cannot sort by createdAt");
            // }
            orderBy[sort.id] = sort.desc ? "desc" : "asc";
          }
        }

        return ctx.prisma.post.findMany({
          take: params.take,
          orderBy,
          where,
        });
      });
    }),
});
