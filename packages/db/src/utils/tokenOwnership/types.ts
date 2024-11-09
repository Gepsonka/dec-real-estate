import { Document, WithId } from "mongodb";
import { WalletAddress } from "../types.ts";
import { TokenModel } from "../token/types.ts";

export interface TokenOwnershipModel extends Document {
  tokenId: string;
  ownerAddress: WalletAddress;
  amount: string;
  burned: boolean;
}

export interface OwnershipWithTokenModel extends WithId<TokenOwnershipModel> {
  token: WithId<TokenModel>;
}
