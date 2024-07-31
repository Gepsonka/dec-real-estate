import { apiPath } from "./constants";

export const clientURLs = {
  home: "/",
  about: "/about",
  contact: "/contact",
  marketplace: "/marketplace",
  token_createToken: "/token/create",
  marketplace_assets: "/marketplace/assets",
  realEstate_instance: (id: string) => `/marketplace/${id}`,
};

export const serverURLs = {
  abi_resolveAbi: (name: string) => `/abi/${name}`,
  realEstate: "/realEstate",
  realEstate_assets: (address: string) => `/realEstate/${address}`,
  realEstate_instance: (id: string) => `/realEstate/${id}`,
};
