import * as dotenv from "dotenv";
dotenv.config();

import { viemPublicClient } from "./utils/blockchain/viemClient.ts";
import { tokenContractAbi, tokenMarketplaceAbi } from "@repo/web3";
import { onLogsTokenContract } from "./utils/blockchain/eventDispatcher.ts";
import * as db from "./utils/db/index.ts";

console.log("rpc url: ", process.env.CHAIN_RPC_URL);
console.log(
  "token contract addr: ",
  process.env.TOKEN_CONTRACT_ADDRESS as `0x${string}`
);

console.log(
  "token marketplace addr:",
  process.env.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`
);

viemPublicClient.watchContractEvent({
  address: process.env.TOKEN_CONTRACT_ADDRESS as `0x${string}`,
  abi: tokenContractAbi,
  onLogs: onLogsTokenContract,
});

viemPublicClient.watchContractEvent({
  address: [process.env.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`],
  abi: tokenMarketplaceAbi,
  onLogs: (logs) => console.log(logs),
});
