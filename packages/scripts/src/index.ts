import { clearDb } from "./clear-db/index.ts";

const arg = process.argv[2];

if (arg === "clear-db") {
  await clearDb();
}
