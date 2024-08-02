"use client";
import { Button } from "~/components/ui/button";

import { utils as XLSXUtils, writeFile as XLSXWriteFile } from "xlsx";

const headers = ["id", "name", "email", "age", "isActive"];
const json_data_to_export = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    age: 28,
    isActive: true,
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    age: 34,
    isActive: false,
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    age: 22,
    isActive: true,
  },
  {
    id: 4,
    name: "Diana",
    email: "diana@example.com",
    age: 31,
    isActive: false,
  },
  {
    id: 5,
    name: "Eve",
    email: "eve@example.com",
    age: 25,
    isActive: true,
  },
];

export function createDefaultFileName() {
  return `${Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  })
    .format(new Date())
    .replace(/[/:]/g, "-")
    .replace(/[\s,]+/g, "_")}.xlsx`;
}

/**
 * @param {{ item: unknown[]; header?: string[]; }} params
 */
export function json2Excel(params) {
  const worksheet = XLSXUtils.json_to_sheet(params.item, {
    header: params.header,
  });

  const wb = XLSXUtils.book_new();
  XLSXUtils.book_append_sheet(wb, worksheet, "sheet1");

  return wb;
}

// console.log("___ convert", convert);
async function start() {
  const workBook = json2Excel({
    item: json_data_to_export,
    header: headers,
  });

  XLSXWriteFile(workBook, createDefaultFileName(), {
    compression: true,
  });
}

export default function XLSXTest() {
  return (
    <section>
      <Button onClick={() => start()}>Test</Button>
    </section>
  );
}
