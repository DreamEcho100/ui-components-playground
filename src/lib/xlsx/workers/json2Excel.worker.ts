// https://medium.com/techhappily/client-side-ai-with-transformers-js-next-js-and-web-worker-threads-259f6d955918
// https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-web-worker?file=worker.ts,utils%2Fpi.ts,pages%2Findex.tsx
import { json2Excel } from "@acme/utils/xlsx";

addEventListener(
  "message",
  (
    event: MessageEvent<{
      header: string[];
      formattedData: Record<string, string>[];
    }>,
  ) => {
    try {
      postMessage({ status: "loading" });

      postMessage({
        status: "success",
        payload: {
          workBook: json2Excel({
            item: event.data.formattedData,
            header: event.data.header,
          }),
        },
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
