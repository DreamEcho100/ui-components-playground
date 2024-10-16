/**
 * Compares two objects and returns the changes.
 * @template Obj1 - Type of the first object.
 * @template Obj2 - Type of the second object.
 * @param {Obj1} compareTo - The object to compare against.
 * @param {Obj2} compareWith - The object to compare with.
 * @returns {Partial<Obj1>} - The changes between the objects.
 */
export function objChanges(compareTo, compareWith) {
  /** @type {Partial<typeof compareTo>} */
  const objWithChanges = {};

  /** @type {string} */
  let key;
  for (key in compareTo) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (compareTo[key] !== compareWith[key])
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      objWithChanges[key] = compareWith[key];
  }

  return objWithChanges;
}

/**
 * Removes specific fields from an object.
 * @template {Record<PropertyKey, unknown>} Obj - Type of the object.
 * @template {keyof Obj | (string & {})} KeysToOmit - Type of the keys to be removed.
 * @param {Obj} obj - The object to remove fields from.
 * @param {KeysToOmit[]} keys - The keys to remove from the object.
 * @returns {import("./types.ts").RemoveFields<Obj, KeysToOmit>} - The object with fields removed.
 */
export function omit(obj, keys) {
  const objCopy =
    /** @type {import("./types.ts").RemoveFields<Obj, KeysToOmit>} */
    ({ ...obj });

  let key;
  for (key of keys) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete objCopy[key];
  }

  /** @type {import("./types.ts").RemoveFields<Obj, KeysToOmit>} */
  return objCopy;
}

/**
 * Removes specific fields from an object.
 * @template {Record<PropertyKey, unknown>} Obj - Type of the object.
 * @template {keyof Obj | (string & {})} KeysToPick - Type of the keys to be removed.
 * @param {Obj} obj - The object to remove fields from.
 * @param {KeysToPick[]} keys - The keys to remove from the object.
 * @returns {Pick<Obj, KeysToPick>} - The object with fields removed.
 */
export function pick(obj, keys) {
  const objCopy =
    /** @type {Pick<Obj, KeysToPick>} */
    ({});

  let key;
  for (key of keys) {
    objCopy[key] = obj[key];
  }

  return objCopy;
}

/**
 * Removes specific fields from an object.
 * @template {Record<PropertyKey, unknown>} Obj - Type of the object.
 * @template {(keyof Obj | (string & {})) | undefined} KeysToOmit
 * @template {{ [Key in keyof Obj]?: Obj[Key] } | undefined} ItemsToTransform
 * @param {Obj} obj - The object to remove fields from.
 * @param {{
 * 	omit?: KeysToOmit[]
 *  transform?: ItemsToTransform
 * }} options - The keys to remove from the object.
 */
export function transform(obj, options) {
  /**
   * @typedef {KeysToOmit extends undefined ? Obj : import("./types.ts").RemoveFields<Obj, KeysToOmit>} OmittedType
   * @typedef {ItemsToTransform extends undefined ? OmittedType : import("./types.ts").TransformFields<OmittedType, ItemsToTransform>} ReturnType
   */

  const objCopy =
    /** @type {ReturnType} */
    ({ ...obj });

  if (options.omit) {
    let key;
    for (key of options.omit) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete objCopy[key];
    }
  }

  /** @type {ReturnType} */
  return objCopy;
}

/**
 * Retrieves an item from an object based on a provided path.
 * @template TObj - Type of the object.
 * @template TRouterPath - Type of the path.
 * @param {unknown} obj - The object to retrieve the item from.
 * @param {string} path - The path to the desired item.
 * @returns {import("./types.ts").GetItemByPath<TObj, TRouterPath>} - The retrieved item.
 */
export function getItemByPath(obj, path) {
  let item =
    /** @type {import("./types.ts").GetItemByPath<typeof obj, typeof path>} */
    (obj);
  const arr = path.split(".");

  let i = 0;
  for (; i < arr.length; i++) {
    item =
      /** @type {import("./types.ts").GetItemByPath<typeof obj, typeof path>} */
      (
        /** @type {Record<PropertyKey, unknown>} */
        (item)[
          /** @type {PropertyKey} */
          (arr[i])
        ]
      );
  }

  return item;
}

/**
 * Retrieves an item from an object based on a provided path.
 * @template T {Record<string, string>} - Type of the object.
 * @param {Record<string, string>} obj - The object to retrieve the item from.
 * @returns {T} - The retrieved item.
 */
export function reverseObj(obj) {
  /** @type {Record<string, string>} */
  const newObj = {};

  for (const key in obj) {
    newObj[
      /** @type {string} */
      (obj[key])
    ] = key;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    /** @type {T} */
    newObj
  );
}
