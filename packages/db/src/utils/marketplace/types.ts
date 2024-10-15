import { Document } from "mongodb";
import { WalletAddress } from "../types.ts";

export interface ListingModel extends Document {
  listingId: string;
  seller: WalletAddress;
  tokenId: string;
  amount: string;
  pricePerToken: string;
}
