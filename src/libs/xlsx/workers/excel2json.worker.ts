// https://medium.com/techhappily/client-side-ai-with-transformers-js-next-js-and-web-worker-threads-259f6d955918
// https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-web-worker?file=worker.ts,utils%2Fpi.ts,pages%2Findex.tsx
import {
  changeSheetHeaderByTitle2Key,
  mapHeaderRow,
  XLSXRead,
  XLSXUtils,
} from "../xlsx_";

// import { conversionConfig } from "../../../app/[lang]/dashboard/(pages)/inventories/items/_utils";

addEventListener(
  "message",
  (
    event: MessageEvent<{
      fileBuffer: ArrayBuffer | string;
      title2Key: Record<string, string>;
    }>,
  ) => {
    try {
      postMessage({ status: "loading" });
      const workbook = XLSXRead(event.data.fileBuffer);
      const sheetName = workbook.SheetNames[0]!;
      const worksheet = workbook.Sheets[sheetName]!;

      mapHeaderRow(
        worksheet,
        changeSheetHeaderByTitle2Key(event.data.title2Key),
      );

      const jsonData = XLSXUtils.sheet_to_json(worksheet);

      postMessage({
        status: "success",
        payload: { jsonData },
      });
    } catch (error) {
      postMessage({
        status: "error",
        payload: {
          message: error instanceof Error ? error.message : String(error),
        },
      });
    }
  },
);
