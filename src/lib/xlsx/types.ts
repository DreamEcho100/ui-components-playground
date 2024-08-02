export type PartialFields<Type, Keys extends keyof Type> = Pick<
  Type,
  Exclude<keyof Type, Keys>
> & {
  [Key in Keys]?: Type[Key];
};

export type Nullable<Type> = Type | null | undefined;

export type NestedKeyOf<ObjectType> = ObjectType extends object
  ? {
      [Key in keyof ObjectType]:
        | `${Key & string}`
        | `${Key & string}.${NestedKeyOf<ObjectType[Key]>}`;
    }[keyof ObjectType]
  : never;

export type RemoveFields<Type, Keys> = {
  [Property in keyof Type as Exclude<Property, Keys>]: Type[Property];
};

export type TransformFields<
  ObjToTransform extends Record<PropertyKey, unknown>,
  TransformedFields extends { [Key in keyof ObjToTransform]?: unknown },
> = {
  [Key in keyof TransformedFields]: TransformedFields[Key];
} & RemoveFields<ObjToTransform, keyof TransformedFields>;

// https://github.com/microsoft/TypeScript/issues/31501
export type GetItemByPath<TObj, TRouterPath> =
  TRouterPath extends `${infer TName}.${infer TNameRest}`
    ? TName extends keyof TObj
      ? GetItemByPath<TObj[TName], TNameRest>
      : never
    : TRouterPath extends keyof TObj
      ? TObj[TRouterPath]
      : never;

export type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${DeepKeys<T[K]>}`}`;
    }[keyof T]
  : never;

export type ValueOrUpdater<Value> = Value | ((value: Value) => Value);

export type DeepestFinalPaths<
  Item,
  Path extends string | undefined = undefined,
> =
  Item extends Record<PropertyKey, unknown>
    ? {
        [Key in keyof Item & string]: DeepestFinalPaths<
          // DeepestPaths<Item[Key], [...Path, Key]>;
          Item[Key],
          Path extends undefined
            ? `${Key & string}`
            : `${Path & string}.${Key & string}`
        >;
      }[keyof Item & string]
    : Path;

export type PickKeysByValue<Obj, TargetedValue> = {
  [Key in keyof Obj]: Obj[Key] extends TargetedValue ? Key : never;
}[keyof Obj];

export type ItemsArrayToItemMappedKeys<
  Items extends readonly Record<string, any>[],
  TargetedKeys extends keyof Items[number],
> = {
  [K in Items[number][TargetedKeys]]: Extract<
    Items[number],
    { [TK in TargetedKeys]: K }
  >;
};

export type ItemsArrayToKeysArray<
  Items extends readonly Record<string, any>[],
  TargetedKeys extends keyof Items[number],
> = Items[number][TargetedKeys][];

export type ItemsArrayToKeysEnum<
  Items extends readonly Record<string, any>[],
  TargetedKeys extends keyof Items[number],
> = {
  [Key in Items[number][TargetedKeys]]: Key;
};
