import {
  Collection,
  MongoClient,
  Document,
  OptionalUnlessRequiredId,
} from "mongodb";
import { MongoDatabase } from "../database/index.ts";
import { TokenModel } from "./types.ts";
import { Clearable } from "../types.ts";

export class Token<TokenModelT extends TokenModel = TokenModel>
  implements Clearable
{
  private database: MongoDatabase;
  private collection: Collection<TokenModelT>;

  constructor(database: MongoDatabase, collectionName: string = "Token") {
    this.database = database;
    this.collection = this.database
      .getDb()
      .collection<TokenModelT>(collectionName);
  }

  async clearCollection(): Promise<void> {
    await this.collection.deleteMany({});
  }

  async createToken(token: TokenModelT) {
    const doc = {
      ...token,
    } as OptionalUnlessRequiredId<TokenModelT>;
    await this.collection.insertOne(doc);
  }
}

export * from "./types.ts";
