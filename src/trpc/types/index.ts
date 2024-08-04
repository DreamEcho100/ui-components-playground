import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouterPaths, AppRouterPathToVars } from "./custom-types";
import type { AppRouter } from "~/server/api/root";
// import type { AppRouter } from "./root";
// import { appRouter } from "./root";
// import { createCallerFactory } from "./trpc";

export type * from "./custom-types";

// export { appRouter, type AppRouter } from "./root";
// export { createTRPCContext } from "./trpc";

// export type RouterPaths = GetAllRouterPaths<AppRouter>;

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export type GetAppRouterInputsByPath<RouterPaths extends AppRouterPaths> =
  AppRouterPathToVars[RouterPaths]["$input"];
export type GetAppRouterOutputsByPath<RouterPaths extends AppRouterPaths> =
  AppRouterPathToVars[RouterPaths]["$output"];

/******************** ********************/
/******************** ********************/
/******************** ********************/
type GetGetOnePaths<Paths> = Paths extends `${string}.getOne` ? Paths : never;
export type InferAppRouterGetOne = GetGetOnePaths<AppRouterPaths>;

type GetGetManyPaths<Paths> = Paths extends
  | `${string}.getMany`
  | `${string}.getManyBasic`
  ? Paths
  : never;
export type InferAppRouterGetManyOrManyBasic = GetGetManyPaths<AppRouterPaths>;

type GetCreateManyPaths<Paths> = Paths extends `${string}.createMany`
  ? Paths
  : never;
export type InferAppRouterCreateMany = GetCreateManyPaths<AppRouterPaths>;

type GetDeleteManyPaths<Paths> = Paths extends `${string}.deleteMany`
  ? Paths
  : never;
export type InferAppRouterDeleteMany = GetDeleteManyPaths<AppRouterPaths>;

type GetDeleteOnePaths<Paths> = Paths extends `${string}.deleteOne`
  ? Paths
  : never;
export type InferAppRouterDeleteOnePaths = GetDeleteOnePaths<AppRouterPaths>;

type GetRestoreOnePaths<Paths> = Paths extends `${string}.restoreOne`
  ? Paths
  : never;
export type InferAppRouterRestoreOne = GetRestoreOnePaths<AppRouterPaths>;

export type InferInfiniteQueryData<TRouterPath extends AppRouterPaths> = ({
  items: unknown[];
} & GetAppRouterOutputsByPath<TRouterPath>)["items"][number];
