import { useState } from "react";
import { TokenBuyPopoverProps } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatEther, parseEther } from "viem";
import { Slider } from "@/components/ui/slider";
import { useWriteContract } from "wagmi";
import { tokenMarketplaceAbi } from "@repo/web3";
import { WalletAddress } from "@repo/db";

export function TokenBuyPopover(props: TokenBuyPopoverProps) {
  const [amountToBuy, setAmountToBuy] = useState<number>(0);
  const { writeContract } = useWriteContract();

  const buyTokens = () => {
    if (amountToBuy === 0) {
      return;
    }
    writeContract({
      abi: tokenMarketplaceAbi,
      address: process.env
        .NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as WalletAddress,
      functionName: "purchaseTokens",
      args: [props.listingId, BigInt(amountToBuy)],
      value: props.pricePerToken * BigInt(amountToBuy),
    });
  };

  const amountToBuyOnChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(event.target.value) > props.amount) {
      setAmountToBuy(props.amount);
      return;
    }

    if (Number(event.target.value) < 0) {
      setAmountToBuy(0);
      return;
    }

    setAmountToBuy(Number(event.target.value));
  };

  const amountToBuyOnChangeHandlerSlider = (value: number[]) => {
    if (value[0] > props.amount) {
      setAmountToBuy(props.amount);
      return;
    }

    if (value[0] < 0) {
      setAmountToBuy(0);
      return;
    }

    setAmountToBuy(value[0]);
  };

  return (
    <Popover>
      <PopoverTrigger>{props.triggerComponent}</PopoverTrigger>
      <PopoverContent>
        <Label htmlFor="amount">Amount to buy</Label>
        <Input
          className="mt-2"
          onChange={amountToBuyOnChangeHandler}
          value={amountToBuy}
          type="number"
          id="amount"
        />
        <div className="flex my-6">
          <Slider
            className="w-full"
            value={[amountToBuy]}
            onValueChange={amountToBuyOnChangeHandlerSlider}
            defaultValue={[0]}
            max={props.amount}
            step={1}
          />
        </div>
        <div className="flex">
          <Button
            onClick={buyTokens}
            className="w-full"
            variant={"destructive"}
          >
            Buy for {formatEther(props.pricePerToken * BigInt(amountToBuy))}ETH
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
