import {
  Collection,
  MongoClient,
  Document,
  OptionalUnlessRequiredId,
} from "mongodb";
import { MongoDatabase } from "../database/index.ts";
import { TokenModel } from "./types.ts";

export class Token<TokenModelT extends Document = TokenModel> {
  private database: MongoDatabase;
  private collection: Collection<TokenModelT>;

  constructor(database: MongoDatabase, collectionName: string = "Token") {
    this.database = database;
    this.collection = this.database
      .getDb()
      .collection<TokenModelT>(collectionName);
  }

  createToken(token: OptionalUnlessRequiredId<TokenModelT>) {
    this.collection.insertOne(token);
  }
}
