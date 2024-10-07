import { type Log } from "viem";

export function onLogs(logs: Log[]) {
  console.log(logs);
}
