import { serverUrls } from "@/utils/urls";
import {
  OwnershipWithTokenModel,
  TokenOwnershipModel,
  WalletAddress,
} from "@repo/db";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WithId } from "mongodb";

async function fetchAssets(
  address: WalletAddress
): Promise<OwnershipWithTokenModel[]> {
  const res = await axios.get(serverUrls.assets(address));

  return res.data;
}

export const useAssets = (address: WalletAddress | undefined) => {
  return useQuery({
    queryKey: ["userAssets", address],
    queryFn: () => fetchAssets(address!),
    staleTime: 5000,
    enabled: !!address,
  });
};
