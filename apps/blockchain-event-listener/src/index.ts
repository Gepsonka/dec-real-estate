import * as dotenv from "dotenv";
dotenv.config();
console.log("rpc url: ", process.env.CHAIN_RPC_URL);

import { viemPublicClient } from "./utils/blockchain/viemClient.ts";
import { tokenContractAbi } from "@repo/web3/abi";
import { onLogs } from "./utils/blockchain/eventDispatcher.ts";

const unwatch = viemPublicClient.watchContractEvent({
  address: [
    process.env.TOKEN_CONTRACT_ADDRESS as `0x${string}`,
    process.env.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
  ],
  abi: tokenContractAbi,
  onLogs: onLogs,
});
