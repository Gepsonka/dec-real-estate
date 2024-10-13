"use client";
import { AssetCard } from "@/components/assets/asset-card";
import { useAssets } from "@/hooks/useAssets";
import { OwnershipWithTokenModel } from "@repo/db";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Assets() {
  const { address, isConnected, isConnecting } = useAccount();
  const assetsQuery = useAssets(address);

  useEffect(() => {
    console.log(address);
    console.log(isConnected);
    console.log(assetsQuery);
  }, [address, isConnected, assetsQuery.data]);

  const renderAssetCards = (assetsData: OwnershipWithTokenModel[]) => {
    return assetsData.map((asset: OwnershipWithTokenModel) => (
      <AssetCard
        tokenName={asset.token.data.tokenName!}
        description={asset.token.data.description}
        amountOwned={BigInt(asset.amount)}
        totalAmount={BigInt(asset.token.amount)}
        tokenId={BigInt(asset.tokenId)}
        tokenCreator={asset.token.creatorAddress}
      />
    ));
  };

  if (assetsQuery.isLoading || isConnecting) {
    return <div>Loading...</div>;
  }

  if (assetsQuery.data === undefined) {
    return <div>resolved undefined</div>;
  }

  return (
    <div className="asset-card-container">
      {renderAssetCards(assetsQuery.data!)}
    </div>
  );
}
