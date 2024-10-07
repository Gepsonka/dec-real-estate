import { createPublicClient, http } from "viem";
import { chain } from "./chain.ts";

export const viemPublicClient = createPublicClient({
  chain: chain,
  transport: http(),
});
