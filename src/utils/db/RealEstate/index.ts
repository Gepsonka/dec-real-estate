import { RealEstateToken } from "./types";

export async function getAllRealEstates(db: any): Promise<RealEstateToken[]> {
  return (await db.all()) as RealEstateToken[];
}

export async function getRealEstateById(
  db: any,
  tokenId: string
): Promise<RealEstateToken> {
  return (await db.get(tokenId)) as RealEstateToken;
}

export async function createRealEstate(
  db: any,
  realEstate: RealEstateToken
): Promise<RealEstateToken> {
  await db.put(realEstate);

  return realEstate;
}
