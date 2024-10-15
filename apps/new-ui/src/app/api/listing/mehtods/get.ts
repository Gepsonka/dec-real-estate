import { listingService } from "@/utils/db";
import { NextResponse } from "next/server";

export async function get(req: Request) {
  const listings = (await listingService.getAllListings()).toArray();

  return NextResponse.json(listings);
}
