import * as dotenv from "dotenv";
import { MongoDatabase, Token, TokenOwnership } from "@repo/db";

dotenv.config();

const mongoDb = new MongoDatabase(
  process.env.MONGO_URI as string,
  process.env.MONGO_DATABASE as string
);

async function clearToken() {
  const tokenService = new Token(mongoDb);
  await tokenService.clearCollection();
}

async function clearOwnership() {
  const ownershipService = new TokenOwnership(mongoDb);
  await ownershipService.clearCollection();
}

export async function clearDb() {
  await clearToken();
  await clearOwnership();
}
