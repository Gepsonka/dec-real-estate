import { tokenContractAbi } from "@repo/web3";
import { type Log, decodeEventLog } from "viem";
import {
  TokenCreatedEventArgs,
  tokenCreatedEventHandler,
} from "./eventHandlers/tokenCreatedEventHandler/index.ts";

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
    if (decodedLog.eventName === "TokenCreated")
      await tokenCreatedEventHandler(args);
  });
}
