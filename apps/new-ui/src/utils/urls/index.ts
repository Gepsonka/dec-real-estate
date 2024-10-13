export const clientUrlPaths = {
  createToken: "/create-token",
  assets: "/assets",
  marketplace: "/marketplace",
  token__id: (id: string) => `/token/${id}`,
};
