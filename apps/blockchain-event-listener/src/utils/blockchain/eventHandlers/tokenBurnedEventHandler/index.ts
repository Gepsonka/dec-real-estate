import { WalletAddress } from "@repo/db";
import { ownershipService, tokenService } from "../../../db/index.ts";

export interface TokenBurnedEventArgs {
  tokenId: bigint;
  burnerAddress: WalletAddress;
}

export async function tokenBurnedEventHandler(args: TokenBurnedEventArgs) {
  await ownershipService.burnToken(args.burnerAddress, args.tokenId);
}
