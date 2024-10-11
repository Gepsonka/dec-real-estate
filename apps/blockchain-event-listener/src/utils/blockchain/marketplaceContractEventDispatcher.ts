import { tokenMarketplaceAbi } from "@repo/web3";
import { decodeEventLog, Log } from "viem";
import {
  TokenPurchasedEventArgs,
  tokenPurchasedEventHandler,
} from "./eventHandlers/tokenPurchasedEventHandler/index.ts";

export function onLogsMarketplaceContract(logs: Log[]) {
  console.log("Marketplace on logs...");
  const decodedEventLogs = logs.map((log) => {
    return decodeEventLog({
      abi: tokenMarketplaceAbi,
      data: log.data,
      topics: log.topics,
    });
  });

  decodedEventLogs.forEach((decodedLog) => {
    console.log(decodedLog);
  });

  decodedEventLogs.forEach(async (decodedLog) => {
    const args: TokenPurchasedEventArgs =
      decodedLog.args as unknown as TokenPurchasedEventArgs;
    if (decodedLog.eventName === "TokensPurchased")
      await tokenPurchasedEventHandler(args);
  });
}
