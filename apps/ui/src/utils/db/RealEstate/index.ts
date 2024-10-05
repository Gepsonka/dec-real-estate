import { RealEstateToken } from "./types";

export async function getAllRealEstates(db: any): Promise<RealEstateToken[]> {
  return (await db.all()) as RealEstateToken[];
}

export async function getRealEstateById(
  db: any,
  tokenId: string
): Promise<any> {
  return (await db.get(tokenId)) as RealEstateToken;
}

export async function createRealEstate(
  db: any,
  realEstate: RealEstateToken
): Promise<any> {
  const res = await db.put(realEstate);

  return res;
}

// For dev purposes
export async function createDummyRealEstates(db: any) {
  const realEstates: RealEstateToken[] = [
    {
      tokenId: "1",
      supply: BigInt(100),
      creator: "0x123",
      tokenName: "Real Estate 1",
      decsription: "This is a real estate",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      tokenId: "2",
      supply: BigInt(200),
      creator: "0x123",
      tokenName: "Real Estate 2 qwe",
      decsription: "This is a real estate 2",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      tokenId: "3",
      supply: BigInt(300),
      creator: "0x123",
      tokenName: "Real Estate 3",
      decsription: "This is a real estate",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  for (const realEstate of realEstates) {
    console.log("Creating real estate: ", realEstate);
    await createRealEstate(db, realEstate);
  }
}

export async function searchRealEstates(
  db: any,
  queryFn: (doc: any) => boolean
) {
  const res = await db.query(queryFn);

  return res;
}
