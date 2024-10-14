import { useState } from "react";
import { TokenBuyPopoverProps } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@radix-ui/react-slider";
import { Button } from "@/components/ui/button";
import { formatEther, parseEther } from "viem";

export function TokenBuyPopover(props: TokenBuyPopoverProps) {
  const [amountToBuy, setAmountToBuy] = useState<number>(0);

  function safeMultiplyEth(ethAmount: string, multiplier: number): string {
    const weiAmount = parseEther(ethAmount);

    const multipliedWeiAmount =
      (weiAmount * BigInt(Math.floor(multiplier * 1e18))) / BigInt(1e18);

    return formatEther(multipliedWeiAmount);
  }

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

  return (
    <Popover>
      <PopoverTrigger>{props.triggerComponent}</PopoverTrigger>
      <PopoverContent>
        <Label htmlFor="amount">Amount to buy:</Label>
        <Input
          onChange={amountToBuyOnChangeHandler}
          value={amountToBuy}
          type="number"
          id="amount"
        />
        <Slider
          value={[amountToBuy]}
          onChange={amountToBuyOnChangeHandler}
          defaultValue={[0]}
          max={props.amount}
          step={1}
        />
        <Button variant={"destructive"}>
          Buy for {safeMultiplyEth(props.pricePerToken.toString(), amountToBuy)}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
