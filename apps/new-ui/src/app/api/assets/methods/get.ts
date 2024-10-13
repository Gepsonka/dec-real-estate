import { ownershipCollection } from "@/utils/db";

export async function get(request: Request) {
  const data = await request.json();
  console.log(data);

  const assets = await ownershipCollection.getUserAssets(data.address);

  return Response.json(assets);
}
