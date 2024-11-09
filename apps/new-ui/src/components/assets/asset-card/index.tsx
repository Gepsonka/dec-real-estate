import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssetCardProps } from "./types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAccount, useWriteContract } from "wagmi";
import { tokenContractAbi } from "@repo/web3";

export function AssetCard(props: AssetCardProps) {
  // never do it like this!
  const account = useAccount();
  const { writeContract } = useWriteContract();

  const convertOwnershipToProgress = (
    amountOwned: number,
    totalAmount: number
  ) => {
    return Number(
      Math.round((Number(amountOwned) / Number(totalAmount)) * 100)
    );
  };

  const allTokensInPosession = () => {
    return props.amountOwned == props.totalAmount;
  };

  return (
    <Card className="asset-card">
      <CardHeader>
        <CardTitle className="text-center">{props.tokenName}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="context-element">
        <p>token ID: {props.tokenId.toString()}</p>
        <p>Amount created: {props.totalAmount.toString()}</p>
        <p>Amount owned: {props.amountOwned.toString()}</p>
        <Progress
          value={convertOwnershipToProgress(
            Number(props.amountOwned),
            Number(props.totalAmount)
          )}
        />
        {allTokensInPosession() && (
          <div className="my-3">
            <Button
              onClick={() =>
                writeContract({
                  abi: tokenContractAbi,
                  address: process.env
                    .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
                  functionName: "burnToken",
                  args: [account.address, props.tokenId],
                })
              }
            >
              Burn
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
