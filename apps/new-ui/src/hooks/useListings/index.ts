import { serverUrls } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchListings() {
  const res = await axios.get(serverUrls.listings);
  return res.data;
}

export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    staleTime: 10000,
  });
}
