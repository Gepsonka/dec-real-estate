import { TokenOwnership } from "@repo/db";
import { ownershipCollection } from "@/utils/db";

type ParamsType = {
  address: `0x${string}`;
};

export async function get(
  request: Request,
  { params }: { params: ParamsType }
) {
  const assets = await ownershipCollection.getUserAssets(params.address);
  return Response.json(assets);
}
