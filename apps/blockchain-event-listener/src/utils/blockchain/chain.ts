import { defineChain } from "viem";
import * as dotenv from "dotenv";

dotenv.config();

console.log("chain url: ", process.env.CHAIN_RPC_URL);

export const chain = defineChain({
  id: 31337,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.CHAIN_RPC_URL as string],
    },
  },
  contracts: {
    token: {
      address: process.env.TOKEN_CONTRACT_ADDRESS,
    },
    marketplace: {
      address: process.env.MARKETPLACE_CONTRACT_ADDRESS,
    },
  },
});
