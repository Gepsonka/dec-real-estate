"use client";
import { ListingCard } from "@/components/marketplace/listing-card";
import { useListings } from "@/hooks/useListings";
import { Listing, WalletAddress } from "@repo/db";
import { tokenMarketplaceAbi } from "@repo/web3";
import { useEffect } from "react";
import { useReadContract } from "wagmi";

export default function Marketplace() {
  const listings = useListings();

  if (listings.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex space-x-2">
      {(listings.data! as Listing[]).map((listing: Listing) => (
        <ListingCard listing={listing} />
      ))}
    </div>
  );
}
