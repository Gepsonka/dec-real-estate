import { Collection, Condition, Document, WithId } from "mongodb";
import { MongoDatabase } from "../database/index.ts";
import { TokenOwnershipModel } from "./types.ts";
import { WalletAddress } from "../types.ts";
import { UserDoesNotHaveTokens } from "./errors.ts";

export class TokenOwnership<
  TokenOwnershipT extends TokenOwnershipModel = TokenOwnershipModel
> {
  private collection: Collection<TokenOwnershipT>;

  constructor(
    private database: MongoDatabase,
    collectionName: string = "TokenOwnership"
  ) {
    this.collection = this.database
      .getDb()
      .collection<TokenOwnershipT>(collectionName);
  }

  async transferTokens(
    tokenId: BigInt,
    from: WalletAddress,
    to: WalletAddress,
    amount: BigInt
  ) {}

  private async getUserToken(address: WalletAddress, tokenId: BigInt) {
    const result = await this.collection.findOne({
      ownerAddress: address as any, // ugly change later!!
      tokenId: tokenId.toString() as any,
    });

    if (!result) {
      throw new UserDoesNotHaveTokens("User has no tokens", {
        address,
        tokenId,
      });
    }

    return result;
  }
}
