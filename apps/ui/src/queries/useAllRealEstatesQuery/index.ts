import { EthAddress, serverURLs } from "@/utils";
import { searchRealEstates } from "@/utils/db/RealEstate";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchUserRealEstates = async (db: any, address: EthAddress) => {
  if (!db) {
    return;
  }
  const res = await searchRealEstates(
    db,
    (doc: any) => doc.creator === address
  );

  return res.data;
};

export const fetchUserRealEstatesQuery = (db: any, address: EthAddress) =>
  useQuery({
    queryKey: ["userRealEstates", address, db],
    queryFn: () => fetchUserRealEstates(db, address),
  });
