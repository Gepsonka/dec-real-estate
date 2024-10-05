import { MarketplaceLayout } from "@/components/marketplace/layout";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useInputValidation } from "@/hooks/useInputValidation";
import { useRealEstateTokenContract } from "@/hooks/useRealEstateTokenContract";
import { useEffect, useState } from "react";
import { Contract, JsonRpcSigner } from "ethers";
import { useAbiQuery } from "@/hooks/useRealEstateTokenContract/query";
import { createToken, getLocalProvider } from "@/utils/ethereum";
import { BaseContract } from "ethers";
import { useDbStore, useMetamaskWalletStore } from "@/stores";
import axios from "axios";
import { serverURLs } from "@/utils";
import RealEstateTokenAbi from "@/abi/RealEstateTokenAbi.json";
import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi";
import { write } from "fs";
import { WriteContractReturnType } from "viem";
import { WriteContractVariables } from "wagmi/query";
import { on } from "events";
import { RealEstateToken } from "@/utils/db/RealEstate/types";
import { createRealEstate } from "@/utils/db/RealEstate";

const CreateListing = () => {
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();
  const db = useDbStore((set: any) => set.db);

  // Needs a better way to handle this, since there is latency in every network
  // request, and might not get the ID of our token
  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_REAL_ESTATE_TOKEN_CONTRACT_ADDRESS as any,
    abi: RealEstateTokenAbi,
    eventName: "TokenCreated",
    onLogs: async (logs: any) => {
      console.log("Logs: ", logs);
      const myTokenId = logs.filter(
        (log: any) => log.args.createdBy === (account.address as string)
      );

      console.log("My Token: ", myTokenId[myTokenId.length - 1].args);

      try {
        const res = await createRealEstate(db, {
          tokenId: myTokenId[myTokenId.length - 1].args.tokenId,
          supply: BigInt(tokenSupplyValidation.value),
          creator: account.address!,
          tokenName: tokenNameValidation.value,
          decsription: descriptionValidation.value,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        });

        console.log("Res: ", res);
      } catch (error) {
        console.log("Error: ", error);
      }
    },
  });

  const tokenNameValidation = useInputValidation([
    {
      rule: /^.+$/,
      errorMessage: "Token name cannot be empty",
    },
  ]);

  const descriptionValidation = useInputValidation([
    { rule: /^.+$/, errorMessage: "Description cannot be empty" },
  ]);

  const tokenSupplyValidation = useInputValidation([
    {
      rule: /^[1-9]\d*$/,
      errorMessage: "Please enter a valid number",
    },
  ]);

  const createListingHandler = async () => {
    if (!account.isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    console.log(
      "Contract address: ",
      process.env.NEXT_PUBLIC_REAL_ESTATE_TOKEN_CONTRACT_ADDRESS
    );

    const result = await writeContractAsync(
      {
        abi: RealEstateTokenAbi,
        address: process.env
          .NEXT_PUBLIC_REAL_ESTATE_TOKEN_CONTRACT_ADDRESS as any,
        functionName: "createToken",
        args: [BigInt(tokenSupplyValidation.value)],
      },
      { ...listingHandlerCallbacks }
    );
  };

  const onTokenCreationSuccess = async (data: WriteContractReturnType) => {
    console.log("Data: ", data);

    const realEstateToken: RealEstateToken = {
      tokenId: "1",
      supply: BigInt(tokenSupplyValidation.value),
      creator: account.address!,
      tokenName: tokenNameValidation.value,
      decsription: descriptionValidation.value,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  };

  const listingHandlerCallbacks = {
    onSuccess: onTokenCreationSuccess,
    onError: (error: any) => {
      console.log("Error: ", error);
    },
    onSettled: () => {
      console.log("Settled");
    },
  };

  return (
    <MarketplaceLayout>
      <div className="subpage-container">
        <h1 className="page-title">Create New Real Estate Token</h1>
        <div className="listing-form-container">
          <div className="input-container">
            <Input
              value={tokenNameValidation.value}
              onChange={tokenNameValidation.onChange}
              errorMessage={
                !tokenNameValidation.isValid && tokenNameValidation.errorMessage
              }
              isInvalid={!tokenNameValidation.isValid}
              label={"Token Name"}
            />
          </div>
          <div className="input-container">
            <Textarea
              value={descriptionValidation.value}
              onChange={descriptionValidation.onChange}
              errorMessage={
                !descriptionValidation.isValid &&
                descriptionValidation.errorMessage
              }
              isInvalid={!descriptionValidation.isValid}
              rows={10}
              variant="bordered"
              disableAutosize
              label={"Description"}
            />
          </div>
          <div className="input-container">
            <Input
              type="number"
              label={"Supply of Tokens"}
              value={tokenSupplyValidation.value}
              onChange={tokenSupplyValidation.onChange}
              errorMessage={
                !tokenSupplyValidation.isValid &&
                tokenSupplyValidation.errorMessage
              }
              isInvalid={!tokenSupplyValidation.isValid}
            />
          </div>
          <div className="input-container">
            <Button onClick={createListingHandler} color="primary">
              Submit Listing
            </Button>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default CreateListing;
