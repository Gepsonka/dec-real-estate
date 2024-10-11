import { createConfig, http } from "wagmi";
import { chain } from "./viem.ts";
import { metaMask } from "wagmi/connectors";

const MetaMaskOptions = {
  dappMetadata: {
    name: "Example React Dapp",
  },
  infuraAPIKey: process.env.INFURA_API_KEY,
};

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: http(),
  },
  connectors: [metaMask(MetaMaskOptions)],
  ssr: true,
});
