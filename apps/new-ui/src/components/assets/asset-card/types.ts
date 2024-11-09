import { WalletAddress } from "@repo/db";

export interface AssetCardProps {
  tokenName: string;
  description: string;
  amountOwned: bigint;
  totalAmount: bigint; // total amount of the token type
  tokenId: bigint;
  tokenCreator: WalletAddress;
  burned?: boolean;
}
