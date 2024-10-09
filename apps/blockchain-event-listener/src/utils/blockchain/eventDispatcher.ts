import { tokenContractAbi } from "@repo/web3";
import { type Log, decodeEventLog } from "viem";
import { tokenDb } from "../db/index.ts";

export interface TokenCreatedEventArgs {
  tokenId: BigInt;
  creatorAddress: `0x${string}`;
  amount: BigInt;
  data: `0x${string}`;
}

export function onLogsTokenContract(logs: Log[]) {
  const decodedEventLogs = logs.map((log) => {
    return decodeEventLog({
      abi: tokenContractAbi,
      data: log.data,
      topics: log.topics,
    });
  });

  decodedEventLogs.forEach((decodedLog) => {
    console.log(decodedLog);
  });

  decodedEventLogs.forEach(async (decodedLog) => {
    const args: TokenCreatedEventArgs =
      decodedLog.args as unknown as TokenCreatedEventArgs;

    const result = await tokenDb.db.put({
      ...args,
    });
  });
}

export function onLogsMarketplaceContract(logs: Log[]) {}
