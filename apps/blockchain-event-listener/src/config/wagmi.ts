import { defineChain, http, createPublicClient } from "viem";

const hardhatLocal = defineChain({
  id: 31337,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["http://localhost:8545"],
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
