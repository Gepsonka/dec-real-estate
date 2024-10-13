export const clientUrlPaths = {
  createToken: "/token/create",
  assets: "/assets",
  marketplace: "/marketplace",
  token__id: (id: string) => `/token/${id}`,
};
