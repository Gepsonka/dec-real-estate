import { WalletAddress } from "@repo/db";

export const clientUrls = {
  createToken: "/token/create",
  assets: "/assets",
  marketplace: "/marketplace",
  createListing: "/marketplace/create-listing",
  token__id: (id: string) => `/token/${id}`,
};

export const serverUrls = {
  assets: (address: WalletAddress) => `/api/assets/${address}`,
  token__id: (tokenId: string) => `/api/token/${tokenId}`,
};
