import {
  Collection,
  Filter,
  OptionalUnlessRequiredId,
  UpdateFilter,
} from "mongodb";
import { MongoDatabase } from "../database/index.ts";
import { OwnershipWithTokenModel, TokenOwnershipModel } from "./types.ts";
import { Clearable, WalletAddress } from "../types.ts";
import {
  OwnershipAlreadyExists,
  UserDoesNotHaveTokens,
  UserInsufficientTokens,
} from "./errors.ts";

export class TokenOwnership<
  TokenOwnershipT extends TokenOwnershipModel = TokenOwnershipModel
> implements Clearable
{
  private collection: Collection<TokenOwnershipT>;

  constructor(
    private database: MongoDatabase,
    collectionName: string = "TokenOwnership"
  ) {
    this.collection = this.database
      .getDb()
      .collection<TokenOwnershipT>(collectionName);
  }

  async getUserAssetsWithTokens(
    address: WalletAddress
  ): Promise<OwnershipWithTokenModel[]> {
    return (await this.collection
      .aggregate([
        {
          $match: {
            ownerAddress: address,
          },
        },
        {
          $lookup: {
            from: "Token",
            localField: "tokenId",
            foreignField: "tokenId",
            as: "token",
          },
        },
        {
          $unwind: {
            path: "$token",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray()) as OwnershipWithTokenModel[];
  }

  async getUserAssets(address: WalletAddress) {
    const filter = {
      ownerAddress: address,
    } as Filter<TokenOwnershipT>;

    return await this.collection.find(filter).toArray();
  }

  async clearCollection(): Promise<void> {
    await this.collection.deleteMany({});
  }

  async transferTokens(
    tokenId: bigint,
    from: WalletAddress,
    to: WalletAddress,
    amount: bigint
  ) {
    await this.receiveTokens(to, tokenId, amount);
    await this.substractTokens(from, tokenId, amount);
  }

  async createOwnership(owner: WalletAddress, tokenId: bigint, amount: bigint) {
    try {
      const tokenOwnership = await this.getUserTokenOwnership(owner, tokenId);
      throw new OwnershipAlreadyExists(
        "User already has ownership of token",
        tokenOwnership
      );
    } catch (err) {
      const doc = {
        tokenId: tokenId.toString(),
        ownerAddress: owner,
        amount: amount.toString(),
        burned: false,
      } as OptionalUnlessRequiredId<TokenOwnershipT>;
      const result = await this.collection.insertOne(doc);
    }
  }

  private async getUserTokenOwnership(address: WalletAddress, tokenId: bigint) {
    const result = await this.collection.findOne({
      ownerAddress: address as any, // ugly, change later!!
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

  private async receiveTokens(
    receiver: WalletAddress,
    tokenId: bigint,
    amountReceived: bigint
  ) {
    try {
      const tokenOwnership = await this.getUserTokenOwnership(
        receiver,
        tokenId
      );

      const filter = {
        tokenId: tokenId.toString(),
        ownerAddress: receiver,
      } as Filter<TokenOwnershipT>;

      const newAmount = BigInt(tokenOwnership.amount) + amountReceived;

      const doc = {
        $set: { amount: newAmount.toString() },
      } as UpdateFilter<TokenOwnershipT>;

      const updatedOwnership = await this.collection.updateOne(filter, doc);
    } catch (err) {
      if (err instanceof UserDoesNotHaveTokens) {
        await this.createOwnership(receiver, tokenId, amountReceived);
      }
    }
  }

  private async substractTokens(
    user: WalletAddress,
    tokenId: bigint,
    amountSubstracted: bigint
  ) {
    const tokenOwnership = await this.getUserTokenOwnership(user, tokenId);
    if (BigInt(tokenOwnership.amount) < amountSubstracted) {
      throw new UserInsufficientTokens(
        "User does not have enough tokens to substract",
        {
          wallet: user,
          tokenId,
          currentTokenBalance: tokenOwnership.amount,
          substractAmount: amountSubstracted,
        }
      );
    } else if (amountSubstracted == BigInt(tokenOwnership.amount)) {
      const deletedOwnership = await this.deleteOwnership(user, tokenId);
      return deletedOwnership;
    } else {
      const newAmount = BigInt(tokenOwnership.amount) - amountSubstracted;

      const filter = {
        ownerAddress: user,
        tokenId: tokenId.toString(),
      } as Filter<TokenOwnershipT>;

      const doc = {
        $set: { amount: newAmount.toString() },
      } as UpdateFilter<TokenOwnershipT>;

      const updatedOwnership = await this.collection.updateOne(filter, doc);
      console.log("updated owner: ", updatedOwnership);
      return updatedOwnership;
    }
  }

  private async deleteOwnership(owner: WalletAddress, tokenId: bigint) {
    const tokenOwnership = await this.getUserTokenOwnership(owner, tokenId);

    // no need to handle if the the ownership does not exists, since the getUserTokenOwnership handles that by throwing error
    const filter = {
      ownerAddress: owner,
      tokenId,
    } as Filter<TokenOwnershipT>;

    const deletedOwnership = await this.collection.deleteOne(filter);

    return deletedOwnership;
  }

  async burnToken(owner: WalletAddress, tokenId: bigint) {
    const filter = {
      ownerAddress: owner,
      tokenId: tokenId.toString(),
    } as Filter<TokenOwnershipT>;

    const update = {
      $set: { burned: true },
    } as UpdateFilter<TokenOwnershipT>;

    const updatedOwnershipRes = await this.collection.updateOne(filter, update);
    return updatedOwnershipRes;
  }
}

export * from "./errors.ts";
export * from "./types.ts";
