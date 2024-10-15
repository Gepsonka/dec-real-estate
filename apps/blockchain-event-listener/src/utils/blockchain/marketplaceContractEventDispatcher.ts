import { tokenMarketplaceAbi } from "@repo/web3";
import { decodeEventLog, Log } from "viem";
import {
  TokenPurchasedEventArgs,
  tokenPurchasedEventHandler,
} from "./eventHandlers/tokenPurchasedEventHandler/index.ts";
import {
  ListingCreatedEventArgs,
  listingCreatedEventHandler,
} from "./eventHandlers/listingCreatedEventHandler/index.ts";

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
    if (decodedLog.eventName === "TokensPurchased") {
      const args: TokenPurchasedEventArgs =
        decodedLog.args as unknown as TokenPurchasedEventArgs;
      await tokenPurchasedEventHandler(args);
    } else if (decodedLog.eventName === "ListingCreated") {
      const args: ListingCreatedEventArgs =
        decodedLog.args as unknown as ListingCreatedEventArgs;
      listingCreatedEventHandler(args);
    }
  });
}
