import { WalletAddress } from "@repo/db";

export interface Listing {
  seller: WalletAddress;
  tokenId: bigint;
  amount: bigint;
  pricePerToken: bigint;
  active: boolean;
}
