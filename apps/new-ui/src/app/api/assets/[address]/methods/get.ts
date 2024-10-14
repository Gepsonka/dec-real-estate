import { TokenOwnership } from "@repo/db";
import { ownershipCollection } from "@/utils/db";

type AssetsParamsType = {
  address: `0x${string}`;
};

export async function get(
  request: Request,
  { params }: { params: AssetsParamsType }
) {
  const assets = await ownershipCollection.getUserAssetsWithTokens(
    params.address
  );
  return Response.json(assets);
}
