import { type Document } from "mongodb";
import { WalletAddress } from "../types.ts";

export interface TokenModel extends Document {
  tokenId: string;
  creatorAddress: WalletAddress;
  amount: string;
  data: any;
}
