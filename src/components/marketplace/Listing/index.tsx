import React, { useEffect } from "react";
import { testRealEstates } from "./constants";
import { RealEstateCard } from "./RealEstateCard";
import { ListingProps } from "./types";
import { useRouter } from "next/router";
import { WithId } from "mongodb";
import { clientURLs } from "@/utils";
import { useReadContract } from "wagmi";
import realEstateTokenAbi from "@/abi/RealEstateTokenAbi.json";

export const Listing = (props: ListingProps) => {
  const router = useRouter();
  if (props.isAssets) {
    const result = useReadContract({
      abi: realEstateTokenAbi,
      address: process.env
        .NEXT_PUBLIC_REAL_ESTATE_TOKEN_CONTRACT_ADDRESS as any,
      functionName: "getAllOwnedTokens",
    });
  }

  // for debug, remove later
  useEffect(() => {
    if (props.isAssets && result.data) {
      console.log("Data: ", result.data);
    }
  }, [result.data]);

  const renderAssets = () => {};

  const renderRealEstateCards = () => {
    if (!props.realEstates) return;
    return props.realEstates.map((realEstate: WithId<RealEstate>) => {
      return (
        <RealEstateCard
          key={realEstate.title}
          title={realEstate.name}
          pricePerToken={realEstate.tokenPrice}
          tokenSupply={realEstate.totalTokenSUpply}
          currentSupply={realEstate.totalTokenSUpply}
          onClick={() => {
            router.push(
              clientURLs.realEstate_instance(realEstate._id.toString())
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
