import { defineChain, http, createPublicClient } from "viem";

const chain = defineChain({
  id: 31337,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.CHAIN_ADDRESS as string],
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

const client = createPublicClient({ chain: chain, transport: http() });
