import { WorkerSharing } from "./worker-sharing";

// worker.js
self.onmessage = function (e) {
  console.log("___ worker.js e", e);
  /** @type {string} */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const id = e.data.id;
  console.log("___ worker.js id", id);

  // Get the item from the shared worker
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const item = WorkerSharing.get(id);
  console.log("___ worker.js item", item);

  // Convert the item to a worksheet

  WorkerSharing.register(`${id}-shared`, "Hello from worker");

  // Request data from the main thread
  postMessage({ type: "requestData", id });
};
