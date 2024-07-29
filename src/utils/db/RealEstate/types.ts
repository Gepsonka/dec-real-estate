export interface RealEstate {
  tokenId: string;
  supply: BigInt;
  creator: string; // wallet address
  baseListingPrice: BigInt;
  createdAt: number;
  updatedAt: number;
}
