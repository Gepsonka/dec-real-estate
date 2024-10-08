import * as dotenv from "dotenv";
dotenv.config();
console.log("rpc url: ", process.env.CHAIN_RPC_URL);
console.log(
  "token contract addr: ",
  process.env.TOKEN_CONTRACT_ADDRESS as `0x${string}`
);

console.log(
  "token marketplace addr:",
  process.env.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`
);

console.log("token abi:", JSON.stringify(tokenContractAbi));

import { viemPublicClient } from "./utils/blockchain/viemClient.ts";
import { tokenContractAbi, tokenMarketplaceAbi } from "@repo/web3";
import { onLogs } from "./utils/blockchain/eventDispatcher.ts";

const tokenContractUnwatch = viemPublicClient.watchContractEvent({
  address: process.env.TOKEN_CONTRACT_ADDRESS as `0x${string}`,
  abi: tokenContractAbi,
  eventName: "TransferSingle",
  onLogs: (logs) => console.log(logs),
});

// const marketplaceContractUnwatch = viemPublicClient.watchContractEvent({
//   address: [process.env.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`],
//   abi: tokenMarketplaceAbi,
//   onLogs: (logs) => console.log(logs),
// });
