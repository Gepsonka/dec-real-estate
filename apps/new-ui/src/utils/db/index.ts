import { Listing, MongoDatabase, Token, TokenOwnership } from "@repo/db";

const db = new MongoDatabase(
  process.env.MONGO_URI as string,
  process.env.MONGO_DATABASE as string
);

export const tokenCollection = new Token(db);
export const ownershipCollection = new TokenOwnership(db);
export const listingService = new Listing(db);
