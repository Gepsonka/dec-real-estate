import { useReadContract, UseReadContractReturnType } from "wagmi";
import realEstateTokenAbi from "@/abi/RealEstateTokenAbi.json";

export const useTokensBalanceHook = (
  tokenIds: BigInt[] | undefined,
  accountAddress: string
): UseReadContractReturnType | undefined => {
  if (!tokenIds) return undefined;

  const accountsList = tokenIds.map((val) => accountAddress);

  const accountTokensResult = useReadContract({
    abi: realEstateTokenAbi,
    address: process.env.NEXT_PUBLIC_REAL_ESTATE_TOKEN_CONTRACT_ADDRESS as any,
    functionName: "balanceOfBatch",
    args: [accountsList, tokenIds],
  });

  return accountTokensResult;
};
