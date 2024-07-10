import React from "react";
import { MarketplaceLayout } from "@/components/marketplace/layout";
import { useFetchRealEstateQuery } from "@/queries";
import { useRouter } from "next/router";
import { Button, Slider } from "@nextui-org/react";
import { buyTokens } from "@/utils/ethereum";
import { useAbiQuery } from "@/hooks/useRealEstateTokenContract/query";
import { useMetamaskWalletStore } from "@/stores";

export default function Marketplace() {
  const router = useRouter();
  const realEstate = useFetchRealEstateQuery(router.query.id as string);
  const abi = useAbiQuery("RealEstateToken");
  const wallet = useMetamaskWalletStore((state) => state);

  const [numOfTokensToBuy, setNumOfTokensToBuy] = React.useState(1);

  const handleTokenBuy = async () => {
    const rx = await buyTokens(
      {
        provider: wallet.provider!,
        signer: wallet.signer!,
        abi: abi.data,
      },
      realEstate.data?.creator as string,
      parseInt(realEstate.data?.tokenId!),
      numOfTokensToBuy,
      realEstate.data!.tokenPrice
    );

    console.log(rx);
  };

  return (
    <MarketplaceLayout>
      <div className="page-container">
        <div className="real-estate-page-information-container">
          <div className="page-element">
            <h1 className="real-estate-title">{realEstate.data?.name}</h1>
          </div>
          <div className="page-element">
            <p className="real-estate-description">
              {realEstate.data?.description}
            </p>
          </div>
          <div className="page-element">
            <Slider
              value={numOfTokensToBuy}
              onChange={(value) => setNumOfTokensToBuy(value as number)}
              label={"Tokens to buy"}
              step={1}
              maxValue={realEstate.data?.totalTokenSUpply}
              minValue={1}
              defaultValue={1}
            />
          </div>
          <div className="page-element mt-4">
            <Button onClick={handleTokenBuy}>Buy</Button>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
