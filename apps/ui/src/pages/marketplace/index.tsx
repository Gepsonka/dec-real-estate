import React from "react";
import { MarketplaceLayout } from "@/components/marketplace/layout/MarketplaceLayout";
import { Listing } from "@/components/marketplace/Listing";
import { fetchUserRealEstatesQuery } from "@/queries";

const Marketplace = () => {
  const allRealEstates = fetchUserRealEstatesQuery();

  return (
    <MarketplaceLayout>
      <Listing realEstates={allRealEstates.data} />
    </MarketplaceLayout>
  );
};

export default Marketplace;
