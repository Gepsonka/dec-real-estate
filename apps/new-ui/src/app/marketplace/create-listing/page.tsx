"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssets } from "@/hooks/useAssets";
import { zodResolver } from "@hookform/resolvers/zod";
import { WalletAddress } from "@repo/db";
import { tokenMarketplaceAbi } from "@repo/web3";
import { useForm } from "react-hook-form";
import { formatUnits, parseEther } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { z } from "zod";

export default function CreateListing() {
  const account = useAccount();
  const assetsQuery = useAssets(account.address);
  const { writeContract } = useWriteContract();

  // TODO: check amount for given token ownership (cannot put up more to sale than owned)
  // needs improvement!
  const CreateListingFormSchema = z.object({
    tokenId: z
      .string()
      .refine(
        (arg: string) => {
          try {
            BigInt(arg);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Must be an integer" }
      )
      .transform((arg: string) => BigInt(arg)),
    amount: z
      .string()
      .refine(
        (arg) => {
          try {
            BigInt(arg);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Must be an integer" }
      )
      .transform((arg) => BigInt(arg)),
    // in eth
    pricePerToken: z.string().refine((arg) => {
      try {
        parseEther(arg);
        return true;
      } catch {
        return false;
      }
    }),
  });

  const listingCreationForm = useForm<z.infer<typeof CreateListingFormSchema>>({
    resolver: zodResolver(CreateListingFormSchema),
    defaultValues: {
      amount: BigInt(0),
      pricePerToken: "0",
    },
  });

  const onSubmit = (data: z.infer<typeof CreateListingFormSchema>) => {
    console.log(data);
    writeContract({
      address: process.env
        .NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as WalletAddress,
      abi: tokenMarketplaceAbi,
      functionName: "createListing",
      args: [data.tokenId, data.amount, parseEther(data.pricePerToken)],
    });
  };

  if (account.isConnecting || assetsQuery.isLoading) {
    return <div>loading...</div>;
  }

  if (account.isDisconnected) {
    return <div>connect your wallet to use the app</div>;
  }

  if (assetsQuery.isSuccess) {
    return (
      <div className="p-4">
        <Form {...listingCreationForm}>
          <form onSubmit={listingCreationForm.handleSubmit(onSubmit)}>
            <FormField
              control={listingCreationForm.control}
              name="tokenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="select token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assetsQuery.data.map((asset) => (
                        <SelectItem
                          key={asset.tokenId.toString()}
                          value={asset.tokenId.toString()}
                        >
                          {asset.token.data.tokenName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={listingCreationForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to put up to sale</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value.toString()} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={listingCreationForm.control}
              name="pricePerToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per token</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-3" type="submit">
              Create Listing
            </Button>
          </form>
        </Form>
      </div>
    );
  }
}
