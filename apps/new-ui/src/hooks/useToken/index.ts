import { serverUrls } from "@/utils/urls";
import { TokenModel } from "@repo/db";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WithId } from "mongodb";

async function fetchTokenById(tokenId: string) {
  const res = await axios.get(serverUrls.token__id(tokenId));

  return res.data;
}

export function useToken(tokenId: string) {
  return useQuery<WithId<TokenModel>>({
    queryKey: ["token", tokenId],
    queryFn: () => fetchTokenById(tokenId),
  });
}
