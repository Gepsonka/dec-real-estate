import {
  Collection,
  Filter,
  OptionalUnlessRequiredId,
  UpdateFilter,
} from "mongodb";
import { MongoDatabase } from "../database/index.ts";
import { Clearable } from "../types.ts";
import { ListingModel } from "./types.ts";

export class Listing<ListingModelT extends ListingModel = ListingModel>
  implements Clearable
{
  private database: MongoDatabase;
  private collection: Collection<ListingModelT>;

  constructor(database: MongoDatabase, collectionName: string = "Listing") {
    this.database = database;
    this.collection = this.database
      .getDb()
      .collection<ListingModelT>(collectionName);
  }

  async clearCollection(): Promise<void> {
    await this.collection.deleteMany({});
  }

  async createListing(listing: ListingModelT) {
    return await this.collection.insertOne(
      listing as OptionalUnlessRequiredId<ListingModelT>
    );
  }

  async purchaseFromListing(listingId: bigint, amountOfTokens: bigint) {
    const filter = {
      listingId,
    } as Filter<ListingModelT>;

    const currentListing = await this.collection.findOne(filter);

    const newAmount = currentListing?.amount - amountOfTokens;

    if (newAmount > 0) {
      const update = {
        amount: currentListing?.amount - amountOfTokens,
      } as UpdateFilter<ListingModelT>;

      await this.collection.updateOne(filter, update);
    } else {
      await this.collection.deleteOne(filter);
    }
  }

  async getAllListings() {
    return await this.collection.find();
  }
}

export * from "./types.ts";
