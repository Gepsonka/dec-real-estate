import { RealEstate } from "./types";

export function getAllRealEstates(db: any): RealEstate[] {
  return db.all() as RealEstate[];
}

export function getRealEstateById(db: any, tokenId: string): RealEstate {
  return db.get(tokenId) as RealEstate;
}

export function createRealEstate(db: any, realEstate: RealEstate): RealEstate {
  return db.put(realEstate) as RealEstate;
}
