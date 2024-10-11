import { WalletAddress } from "@repo/db";

export interface TokenPurchasedEventArgs {
  listingId: bigint;
  buyer: WalletAddress;
  amount: bigint;
}
