"use client";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Listing } from "@/utils/marketplace";
import { WalletAddress } from "@repo/db";
import { tokenMarketplaceAbi } from "@repo/web3";
import { useEffect } from "react";
import { useReadContract } from "wagmi";

export default function Marketplace() {
  const result = useReadContract({
    abi: tokenMarketplaceAbi,
    address: process.env
      .NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as WalletAddress,
    functionName: "getAllActiveListings",
  });

  useEffect(() => {
    console.log(result.data);
  }, []);

  if (result.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex space-x-2">
      {(result.data! as Listing[]).map((listing: Listing) => (
        <ListingCard listing={listing} />
      ))}
    </div>
  );
}
