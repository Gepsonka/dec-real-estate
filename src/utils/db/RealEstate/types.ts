export interface RealEstateToken {
  _id: string; // token id
  supply: BigInt;
  creator: `0x${string}`; // wallet address
  tokenName: string;
  decsription: string;
  createdAt: number;
  updatedAt: number;
}
