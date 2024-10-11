import { tokenContractAbi } from "@repo/web3";
import { type Log, decodeEventLog } from "viem";
import { ownershipService, tokenService } from "../db/index.ts";
import { TokenModel, TokenOwnershipModel } from "@repo/db";

export interface TokenCreatedEventArgs {
  tokenId: bigint;
  creatorAddress: `0x${string}`;
  amount: bigint;
  data: `0x${string}`;
}

export function convertHexDataToJson(data: `0x${string}`) {
  const cleanHex = data.slice(2);

  // Convert hex to a regular string
  const jsonString = Buffer.from(cleanHex, "hex").toString("utf8");

  // Parse the string as JSON
  return JSON.parse(jsonString);
}

async function tokenCreatedEventEmitted(args: TokenCreatedEventArgs) {
  let decodedData: any;
  try {
    decodedData = convertHexDataToJson(args.data);
  } catch (err) {
    console.error(err);
    decodedData = {};
  }

  // create token in db
  const token: TokenModel = {
    tokenId: args.tokenId.toString(),
    creatorAddress: args.creatorAddress,
    amount: args.amount.toString(),
    data: decodedData,
  };
  await tokenService.createToken(token);

  // assign ownership
  await ownershipService.createOwnership(
    args.creatorAddress,
    args.tokenId,
    args.amount
  );
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
    if (decodedLog.eventName === "TokenCreated")
      await tokenCreatedEventEmitted(args);
  });
}

export function onLogsMarketplaceContract(logs: Log[]) {}
