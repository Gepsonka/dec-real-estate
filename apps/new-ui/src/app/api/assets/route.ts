import { ownershipCollection } from "@/utils/db";
import { get } from "./methods/get";

//export const GET = get;
export async function GET(request: Request) {
  const data = await request.json();
  console.log(data);

  const assets = await ownershipCollection.getUserAssets(data.address);

  return Response.json(assets);
}
