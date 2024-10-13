"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAccount, useWriteContract } from "wagmi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { tokenContractAbi } from "@repo/web3";
import { stringToHex } from "viem";

const formSchema = z.object({
  tokenName: z.string().min(1, { message: "Cannot be empty." }),
  description: z
    .string()
    .max(100, { message: "description cannot exceed 100 characters." }),
  amount: z.string().refine(
    (value) => {
      try {
        const bigIntValue = BigInt(value);
        return bigIntValue > BigInt(0);
      } catch {
        return false;
      }
    },
    { message: "Min amount is 1." }
  ),
  // pricePerToken: z
  //   .string()
  //   .refine(
  //     (value) => {
  //       const num = parseFloat(value);
  //       return !isNaN(num) && isFinite(num) && num > 0;
  //     },
  //     {
  //       message: "Please enter a valid positive number",
  //     }
  //   )
  //   .transform((value) => parseFloat(value)),
});

export default function CreateToken() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      writeContract({
        abi: tokenContractAbi,
        address: process.env
          .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "createToken",
        args: [
          process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS,
          data.amount,
          stringToHex(
            JSON.stringify({
              tokenName: data.tokenName,
              description: data.description,
            })
          ),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-[50%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="tokenName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of tokens</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create Token</Button>
        </form>
      </Form>
    </div>
  );
}
