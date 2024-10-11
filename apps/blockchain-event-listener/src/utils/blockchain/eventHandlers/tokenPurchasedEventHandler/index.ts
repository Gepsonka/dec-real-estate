import { readContract } from "viem/actions";
import { TokenPurchasedEventArgs } from "./types.ts";
import { viemPublicClient } from "../../viemClient.ts";
import { tokenMarketplaceAbi } from "@repo/web3";

export async function tokenPurchasedEventHandler(
  args: TokenPurchasedEventArgs
) {
  viemPublicClient.readContract;

  const listing = viemPublicClient.readContract({
    address: process.env.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
    abi: tokenMarketplaceAbi,
    functionName: "getListingById",
    args: [args.listingId],
  });
}

export * from "./types.ts";
