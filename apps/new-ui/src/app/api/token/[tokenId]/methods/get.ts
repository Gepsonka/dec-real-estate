import { tokenCollection } from "@/utils/db";
import { TokenNotExists } from "@repo/db";
import { NextResponse } from "next/server";

interface TokenParamsType {
  tokenId: string;
}

export async function get(
  req: Request,
  { params }: { params: TokenParamsType }
) {
  try {
    const token = await tokenCollection.getTokenById(params.tokenId);
    return NextResponse.json(token);
  } catch (err) {
    if (err instanceof TokenNotExists) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }

    console.log(err);

    return NextResponse.error();
  }
}
