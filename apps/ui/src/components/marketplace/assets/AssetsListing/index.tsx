import React, { useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import realEstateTokenAbi from "@/abi/RealEstateTokenAbi.json";
import { useRouter } from "next/router";
import { wagmiConfig } from "@/config/wagmi";
import { type UseReadContractReturnType } from "wagmi";
import { useTokensBalanceHook } from "@/hooks/useTokensBalance";
import { readContract } from "@wagmi/core";

export function AssetsListing() {
  const router = useRouter();
  const account = useAccount();
  const accountTokensResult = useReadContract({
    abi: realEstateTokenAbi,
    address: process.env.NEXT_PUBLIC_REAL_ESTATE_TOKEN_CONTRACT_ADDRESS as any,
    functionName: "getAllOwnedTokens",
  });

  const extractTokenIds = (): BigInt[] | undefined => {
    if (accountTokensResult.data) {
      return (
        accountTokensResult.data as { owner: string; tokenId: BigInt }[]
      ).map((token) => token.tokenId);
    }
    return undefined;
  };

  const [assets, setAssets] = React.useState([]);

  const getaccountTokenBalances = async (
    address: string,
    tokenIds: BigInt[]
  ) => {
    const accountList = tokenIds.map((val) => address);

    return await readContract(wagmiConfig, {
      abi: realEstateTokenAbi,
      address: process.env
        .NEXT_PUBLIC_REAL_ESTATE_TOKEN_CONTRACT_ADDRESS as any,
      functionName: "balanceOfBatch",
      args: [accountList, tokenIds],
    });
  };

  // for debug, remove later
  useEffect(() => {
    if (accountTokensResult.data) {
      console.log("Token Data: ", accountTokensResult.data);
      const tokenIds: BigInt[] = (
        accountTokensResult.data as { owner: string; tokenId: BigInt }[]
      ).map((token) => token.tokenId);

      const result = getaccountTokenBalances(
        account.address as string,
        tokenIds
      );

      console.log(
        "Result: ",
        result.then((res: any) => console.log(res.data))
      );
    }
  }, [accountTokensResult.status]);

  const renderRealEstateCards = () => {
    return null;
  };

  return (
    <div>
      <div>
        <h1 className="page-title">My Assets</h1>
      </div>
      <div className="real-estate-card-container">
        {renderRealEstateCards()}
      </div>
    </div>
  );
}
