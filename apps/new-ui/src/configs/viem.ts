import { defineChain } from "viem";

export const chain = defineChain({
  id: 31337,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_CHAIN_RPC_URL as string],
    },
  },
  contracts: {
    token: {
      address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
    },
    marketplace: {
      address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS,
    },
  },
});
