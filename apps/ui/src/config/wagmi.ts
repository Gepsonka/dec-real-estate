import { localhost } from "@wagmi/core/chains";
import { http, createConfig } from "@wagmi/core";
import { defineChain } from "viem";
import { metaMask } from "@wagmi/connectors";
import { Config } from "wagmi";

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
    RealEstate: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    },
  },
});

const MetaMaskOptions = {
  dappMetadata: {
    name: "Example React Dapp",
  },
  infuraAPIKey: process.env.INFURA_API_KEY,
};

export const wagmiConfig: Config = createConfig({
  chains: [hardhatLocal],
  transports: {
    [hardhatLocal.id]: http(),
  },
  connectors: [metaMask(MetaMaskOptions)],
  ssr: true,
});
