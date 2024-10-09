import { type Document } from "mongodb";
import { WalletAddress } from "../types.ts";

export interface TokenModel extends Document {
  tokenId: BigInt;
  creatorAddress: WalletAddress;
  amount: BigInt;
  data: any;
}
