import { serverURLs } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchAllRealEstates = async () => {
  const res = await axios.get(serverURLs.realEstate);

  console.log(res.data);

  return res.data;
};

export const useAllRealEstatesQuery = () =>
  useQuery({
    queryKey: ["realEstates"],
    queryFn: fetchAllRealEstates,
  });
