import { WalletAddress } from "@repo/db";

export interface TokenPurchasedEventArgs {
  listingId: bigint;
  buyer: WalletAddress;
  amount: bigint;
}

export interface Listing {
  seller: WalletAddress;
  tokenId: bigint;
  amount: bigint;
  pricePerToken: bigint;
  active: boolean;
}
