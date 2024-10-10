import { Document } from "mongodb";
import { WalletAddress } from "../types.ts";

export interface TokenOwnershipModel extends Document {
  tokenId: string;
  ownerAddress: WalletAddress;
  amount: string;
}
