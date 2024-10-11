import { TokenModel } from "@repo/db";
import { ownershipService, tokenService } from "../../../db/index.ts";

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

export async function tokenCreatedEventHandler(args: TokenCreatedEventArgs) {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
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
