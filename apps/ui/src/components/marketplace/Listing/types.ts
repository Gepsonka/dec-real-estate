import { RealEstate } from "@/utils/db/RealEstateCollection/types";
import { WithId } from "mongodb";

export interface ListingProps {
  isAssets?: boolean;
  realEstates: WithId<RealEstate>[];
}
