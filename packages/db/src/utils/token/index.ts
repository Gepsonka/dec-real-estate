import {
  Collection,
  MongoClient,
  Document,
  OptionalUnlessRequiredId,
  WithId,
  Filter,
} from "mongodb";
import { MongoDatabase } from "../database/index.ts";
import { TokenModel } from "./types.ts";
import { Clearable } from "../types.ts";
import { TokenNotExists } from "./errors.ts";

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

  async getTokenById(tokenId: string): Promise<WithId<TokenModelT>> {
    const filter = {
      tokenId: tokenId,
    } as Filter<TokenModelT>;

    const res = await this.collection.findOne(filter);
    if (!res) {
      throw new TokenNotExists("Token with the given id does not exits", {
        tokenId,
      });
    }

    return res;
  }

  async createToken(token: TokenModelT) {
    const doc = {
      ...token,
    } as OptionalUnlessRequiredId<TokenModelT>;
    await this.collection.insertOne(doc);
  }
}

export * from "./types.ts";
export * from "./errors.ts";
