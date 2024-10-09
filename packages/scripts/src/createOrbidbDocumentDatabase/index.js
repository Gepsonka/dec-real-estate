import { createOrbitDatabase, startOrbitDB } from "@repo/db/dbConnection";
import fs from "fs";
import os from "os";

const DB_NAME = "RealEstate"
const TYPE = "documents"
const INDEX_BY = "tokenId"


export function writeAddress(address, filename = "orbitdbAddressToken.json") {
  const dataString = JSON.stringify({
    address
  })
  fs.writeFileSync(`${os.homedir()}/.ipfs/addresses/${filename}`, dataString, 'utf-8')
}


export async function createDb() {
  const orbitdb = await startOrbitDB()
  const {db, _} = await createOrbitDatabase({orbitdb: orbitdb, dbName: DB_NAME, type: TYPE, indexBy: INDEX_BY});  
  console.log("address: ", db.address)

  writeAddress(db.address)
}


