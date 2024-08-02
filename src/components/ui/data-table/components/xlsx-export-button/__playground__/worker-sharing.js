export class WorkerSharing {
  /** @type {Map<string | number, any>} */
  static #id2item = new Map();

  /**
   * @param {string | number} id
   * @param {any} item
   */
  static register(id, item) {
    this.#id2item.set(id, item);
  }

  /**
   * @template Item
   * @param {string | number} id
   * @param {{
   *  shouldUnregister?: boolean;
   * }} [options]
   * @returns {Item}
   */
  static get(id, options) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const item = /** @type {Item} */ (
      /** @type {unknown} */ (this.#id2item.get(id))
    );

    if (options?.shouldUnregister) {
      this.#id2item.delete(id);
    }

    return item;
  }

  /** @param {string | number} id */
  static has(id) {
    return this.#id2item.has(id);
  }

  /**
   * @param {string | number} id
   */
  static unregister(id) {
    this.#id2item.delete(id);
  }

  static clearAll() {
    this.#id2item.clear();
  }

  static getKeys() {
    return this.#id2item.keys();
  }
  static get size() {
    return this.#id2item.size;
  }

  static [Symbol.iterator]() {
    return this.#id2item[Symbol.iterator]();
  }
}
