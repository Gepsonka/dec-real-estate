import { tokenContractAbi } from "@repo/web3";
import { type Log, decodeEventLog } from "viem";

export function onLogs(logs: Log[]) {
  console.log(logs);
  logs.forEach((log) => {
    console.log(
      decodeEventLog({
        abi: tokenContractAbi,
        data: log.data,
        topics: log.topics,
      })
    );
  });
}
