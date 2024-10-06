import { chain } from "@repo/configs/viem";
import { createPublicClient, http } from "viem";

export const viemPublicClient = createPublicClient({
  chain: chain,
  transport: http(),
});
