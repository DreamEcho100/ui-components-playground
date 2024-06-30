import type {
  AnyProcedure,
  inferProcedureInput,
  inferTransformedProcedureOutput,
} from "@trpc/server";
import type {
  AnyClientTypes,
  RouterRecord,
} from "@trpc/server/unstable-core-do-not-import";
import { AppRouter } from "~/server/api/root";

// import type { AppRouter } from "./root";

/**************** ****************/

// https://www.roryba.in/programming/2019/10/12/flattening-typescript-union-types.html
// https://stackoverflow.com/a/50375286/3370341
// Converts a union of two types into an intersection
// i.e. A | B -> A & B
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

// // Flattens two union types into a single type with optional values
// // i.e. FlattenUnion<{ a: number, c: number } | { b: string, c: number }> = { a?: number, b?: string, c: number }
// type FlattenUnion<T> = {
//   [K in keyof UnionToIntersection<T>]: K extends keyof T
//     ? T[K] extends any[]
//       ? T[K]
//       : T[K] extends object
//         ? FlattenUnion<T[K]>
//         : T[K]
//     : UnionToIntersection<T>[K] | undefined;
// };

type RouterPathToVars<Item, Prefix extends string = ""> =
  Item extends Record<string, unknown>
    ? UnionToIntersection<
        {
          [Key in keyof Item]: Item[Key] extends {
            $input: unknown;
            $output: unknown;
          }
            ? { [P in `${Prefix}${Key & string}`]: Item[Key] }
            : RouterPathToVars<Item[Key], `${Prefix}${Key & string}.`>;
        }[keyof Item]
      >
    : never;

type InferRouterVars<
  TRoot extends AnyClientTypes,
  TRecord extends RouterRecord,
  TPathAcc = "",
> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends infer $Value
    ? $Value extends RouterRecord
      ? InferRouterVars<
          TRoot,
          $Value,
          TPathAcc extends ""
            ? TKey & string
            : `${TPathAcc & string}.${TKey & string}`
        >
      : $Value extends AnyProcedure
        ? {
            $input: inferProcedureInput<$Value>;
            $output: inferTransformedProcedureOutput<TRoot, $Value>;
            $path: TPathAcc extends ""
              ? TKey & string
              : `${TPathAcc & string}.${TKey & string}`;
          }
        : never
    : never;
};

export type AppRouterVars = InferRouterVars<
  AppRouter["_def"]["_config"]["$types"],
  AppRouter["_def"]["record"]
>;
//
export type AppRouterPathToVars = RouterPathToVars<AppRouterVars>;
export type AppRouterPaths = keyof AppRouterPathToVars;
//
export type GetSpecificPaths<Paths, STR> = Paths extends STR // `${string}.restoreOne`
  ? Paths
  : never;

/**************** ****************/
