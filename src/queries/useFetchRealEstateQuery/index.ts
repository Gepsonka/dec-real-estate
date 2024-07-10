import { serverURLs } from "@/utils";
import { RealEstate } from "@/utils/db/RealEstateCollection/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WithId } from "mongodb";

export const fetchRealEstate = async (
  id: string
): Promise<WithId<RealEstate>> => {
  const res = await axios.get(serverURLs.realEstate_instance(id));

  return res.data;
};

export const useFetchRealEstateQuery = (id: string) =>
  useQuery({
    queryKey: ["realEstate", id],
    queryFn: () => fetchRealEstate(id),
  });
