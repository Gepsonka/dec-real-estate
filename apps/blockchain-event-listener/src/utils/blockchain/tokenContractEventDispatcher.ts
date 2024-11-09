import { tokenContractAbi } from "@repo/web3";
import { type Log, decodeEventLog } from "viem";
import {
  TokenCreatedEventArgs,
  tokenCreatedEventHandler,
} from "./eventHandlers/tokenCreatedEventHandler/index.ts";
import {
  TokenBurnedEventArgs,
  tokenBurnedEventHandler,
} from "./eventHandlers/tokenBurnedEventHandler/index.ts";

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
    if (decodedLog.eventName === "TokenCreated") {
      const args: TokenCreatedEventArgs =
        decodedLog.args as unknown as TokenCreatedEventArgs;
      await tokenCreatedEventHandler(args);
    } else if (decodedLog.eventName === "TokenBurned") {
      const args: TokenBurnedEventArgs =
        decodedLog.args as unknown as TokenBurnedEventArgs;
      await tokenBurnedEventHandler(args);
    }
  });
}
