import { Document } from "mongodb";
import { WalletAddress } from "../types.ts";

export interface TokenOwnershipModel extends Document {
  tokenId: BigInt;
  ownerAddress: WalletAddress;
  amount: BigInt;
}
