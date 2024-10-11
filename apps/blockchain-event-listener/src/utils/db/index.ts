import { MongoDatabase, Token, TokenOwnership } from "@repo/db";
import * as dotenv from "dotenv";

dotenv.config();

export const db = new MongoDatabase(
  process.env.MONGO_URI as string,
  process.env.MONGO_DATABASE as string
);

export const tokenService = new Token(db);

export const ownershipService = new TokenOwnership(db);
