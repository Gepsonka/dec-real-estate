import { WalletAddress } from "@repo/db";
import { listingService } from "../../../db/index.ts";

export interface ListingCreatedEventArgs {
  listingId: bigint;
  seller: WalletAddress;
  tokenId: bigint;
  amount: bigint;
  pricePerToken: bigint;
}

export async function listingCreatedEventHandler(
  args: ListingCreatedEventArgs
) {
  await listingService.createListing({
    listingId: args.listingId.toString(),
    seller: args.seller,
    tokenId: args.tokenId.toString(),
    amount: args.amount.toString(),
    pricePerToken: args.pricePerToken.toString(),
  });
}
