import { createDb } from "./createOrbidbDocumentDatabase/index.js";


const args = process.argv.slice(2);


if (args[0] == 'create-orbit-db') {
  await createDb()
}