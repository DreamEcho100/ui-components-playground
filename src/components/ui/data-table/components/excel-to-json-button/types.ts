export interface JSONResult {
  data: {
    name: string;
    cols: {
      width: number;
    }[];
    rows: {
      height: number;
    }[];
    cells: ({
      v: string;
      s: number;
    } | null)[][];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    merged: any[];
  }[];
  styles: {
    borderRight: string;
    borderTop: string;
    borderLeft: string;
    fontSize: string;
    format: string;
    fontFamily: string;
    borderBottom: string;
  }[];
}

export type TConvert = (
  jsonData: File | ArrayBuffer | string,
  config?: Record<string, unknown>,
) => Promise<JSONResult>;
