export type handleCursorPageQuery = <
  Input extends {
    limit?: number | null | undefined;
    direction?: "forward" | "backward";
  },
  Item extends Record<string, unknown>,
  ResolvedTo extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nextCursor: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevCursor: any;
    items: Item[];
  },
>(options: {
  getItems: (params: {
    input: Input;
    limit: number;
    take: number;
  }) => Promise<Item[]>;
  input: Input;
  defaultLimit?: number;
  resolveTo: (options: {
    items: Item[];
    input: Input;
    limit: number;
  }) => ResolvedTo;
}) => Promise<ResolvedTo>;
