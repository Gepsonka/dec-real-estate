import React from "react";
import { MarketplaceLayout } from "@/components/marketplace/layout/MarketplaceLayout";
import { Listing } from "@/components/marketplace/Listing";
import { useAllRealEstatesQuery } from "@/queries";

const Marketplace = () => {
  const allRealEstates = useAllRealEstatesQuery();

  return (
    <MarketplaceLayout>
      <Listing realEstates={allRealEstates.data} />
    </MarketplaceLayout>
  );
};

export default Marketplace;
