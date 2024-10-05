import Marketplace from "@/pages/marketplace";
import React from "react";
import { MarketplaceLayout } from "../layout";
import { AssetsListing } from "./AssetsListing";

export const Assets = () => {
  return (
    <MarketplaceLayout>
      <AssetsListing />
    </MarketplaceLayout>
  );
};
