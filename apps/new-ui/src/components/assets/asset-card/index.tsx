import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssetCardProps } from "./types";
import { Progress } from "@/components/ui/progress";

export function AssetCard(props: AssetCardProps) {
  const convertOwnershipToProgress = (
    amountOwned: number,
    totalAmount: number
  ) => {
    return Number(
      Math.round((Number(amountOwned) / Number(totalAmount)) * 100)
    );
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
      </CardContent>
    </Card>
  );
}
