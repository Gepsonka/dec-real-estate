import React, { useEffect } from "react";
import { RealEstateCard } from "../RealEstateCard";
import { ListingProps } from "./types";
import { useRouter } from "next/router";
import { clientURLs } from "@/utils";
import { useReadContract } from "wagmi";
import realEstateTokenAbi from "@/abi/RealEstateTokenAbi.json";
import { getAllRealEstates } from "@/utils/db/RealEstate";
import { useDbStore } from "@/stores";
import { RealEstateToken } from "@/utils/db/RealEstate/types";

export const Listing = (props: ListingProps) => {
  const router = useRouter();
  const db = useDbStore((state: any) => state.db);
  if (props.isAssets) {
    const result = useReadContract({
      abi: realEstateTokenAbi,
      address: process.env
        .NEXT_PUBLIC_REAL_ESTATE_TOKEN_CONTRACT_ADDRESS as any,
      functionName: "getAllOwnedTokens",
    });
  }

  // TODO: Put this in a hook
  const fetchRealEstates = async () => {
    if (!db) return;
    const realEstates = await getAllRealEstates(db);
    console.log(realEstates);
  };

  useEffect(() => {
    fetchRealEstates();
  }, [db]);

  const renderAssets = () => {};

  const renderRealEstateCards = () => {
    if (!props.realEstates) return;
    return props.realEstates.map((realEstate: RealEstateToken) => {
      return (
        <RealEstateCard
          key={realEstate.tokenId}
          title={realEstate.tokenName}
          pricePerToken={realEstate.tokenPrice}
          tokenSupply={realEstate.totalTokenSUpply}
          tokensAvailable={realEstate.totalTokenSUpply}
          onClick={() => {
            router.push(
              clientURLs.realEstate_instance(realEstate.tokenId.toString())
            );
          }}
          creator={realEstate.creator.toString()}
        />
      );
    });
  };

  return (
    <div>
      <div>
        <h1 className="page-title">Real Estate Listing</h1>
      </div>
      <div className="real-estate-card-container">
        {renderRealEstateCards()}
      </div>
    </div>
  );
};
