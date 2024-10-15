import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListingCardProps } from "./types";
import { useToken } from "@/hooks/useToken";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { TokenBuyPopover } from "./token-buy-popover";

export function ListingCard(props: ListingCardProps) {
  // do not do this in reusable components
  const tokenRes = useToken(props.listing.tokenId.toString());

  if (tokenRes.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>Loading....</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (tokenRes.isError) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>Error fetching the listing</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tokenRes.data?.data.tokenName}</CardTitle>
        <CardDescription>{tokenRes.data?.data.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>seller: {props.listing.seller}</p>
        <p>amount remaining: {props.listing.amount}</p>
        <p>
          Price per token: {formatEther(BigInt(props.listing.pricePerToken))}{" "}
          ETH
        </p>
      </CardContent>
      <CardFooter>
        <TokenBuyPopover
          triggerComponent={<Button variant={"outline"}>Buy</Button>}
          amount={Number(props.listing.amount)}
          pricePerToken={BigInt(props.listing.pricePerToken)}
        />
      </CardFooter>
    </Card>
  );
}
