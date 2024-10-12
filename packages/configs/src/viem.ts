import { defineChain, http, createPublicClient } from "viem";

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

type CreateChainArgs = {
  chainRpcUrl: string;
  tokenContractAddress: `0x${string}`;
  marketplaceContractAddress: `0x${string}`;
};

export function createChain({
  chainRpcUrl,
  tokenContractAddress,
  marketplaceContractAddress,
}: CreateChainArgs) {
  return defineChain({
    id: 31337,
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: {
        http: [chainRpcUrl as string],
      },
    },
    contracts: {
      token: {
        address: tokenContractAddress,
      },
      marketplace: {
        address: marketplaceContractAddress,
      },
    },
  });
}
