/**
 * Retrieves a value from an object based on a dot-separated string path.
 * @param {Object} base - The base object to retrieve the value from.
 * @param {string} strPath - The dot-separated string path specifying the value to retrieve.
 * @returns {*} The value at the specified path, or `undefined` if the path does not exist.
 *
 * @example
 * const obj = { a: { b: { c: 42 } } };
 * const value = getItemByPath(obj, 'a.b.c'); // 42
 */
export function getItemByPath(base, strPath) {
  if (!base || !strPath) return undefined;

  const pathArray = strPath.split(".");
  let current = base;

  for (let path of pathArray) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (current[path] === undefined) {
      return undefined;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      current = current[path];
    }
  }

  return current;
}
