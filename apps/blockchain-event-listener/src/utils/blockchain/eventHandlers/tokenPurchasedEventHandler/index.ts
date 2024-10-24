import { Listing, TokenPurchasedEventArgs } from "./types.ts";
import { viemPublicClient } from "../../viemClient.ts";
import { tokenMarketplaceAbi } from "@repo/web3";
import { listingService, ownershipService } from "../../../db/index.ts";

export async function tokenPurchasedEventHandler(
  args: TokenPurchasedEventArgs
) {
  const listing = (await viemPublicClient.readContract({
    address: process.env.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
    abi: tokenMarketplaceAbi,
    functionName: "getListingById",
    args: [args.listingId],
  })) as unknown as Listing;

  console.log("Listing: ", listing);

  console.log("args: ", args);

  await ownershipService.transferTokens(
    listing.tokenId,
    listing.seller,
    args.buyer,
    args.amount
  );

  await listingService.purchaseFromListing(args.listingId, args.amount);
}

export * from "./types.ts";
