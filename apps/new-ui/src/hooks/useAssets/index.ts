import { useAccount } from "wagmi";

export function useAssets() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return { asstes: null, error: true };
  }
}
