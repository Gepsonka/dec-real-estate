import { createLibp2p } from "libp2p";
import { createHelia } from "helia";
import { createOrbitDB, Documents, IPFSAccessController } from "@orbitdb/core";
import { LevelBlockstore } from "blockstore-level";
import { bitswap } from '@helia/block-brokers';
import {Libp2p2Options} from "@repo/configs/libp2p";

export const startOrbitDB = async ({ id, identity, identities, directory } = {}) => {
  const libp2p = await createLibp2p({ ...Libp2p2Options })
  directory = directory || '.'
  const blockstore = new LevelBlockstore(`${directory}/ipfs/blocks`)
  const ipfs = await createHelia({ libp2p, blockstore, blockBrokers: [bitswap()] })
  const orbitdb = await createOrbitDB({ ipfs, id, identity, identities, directory })
  return orbitdb
}


export async function createOrbitDatabase({dbName, type, indexBy} = {}) {
  console.log('Creating new database');
  const db = await orbitdb.open(dbName, {type, Database: Documents({indexBy}),  AccessController: IPFSAccessController({ write: ['*'] })})
  return {db, orbitdb}
}


export async function connectOrbitDatabase(address) {
  const db = await orbitdb.open(address)
  return {db, orbitdb}
}

export async function stopOrbitDb(orbitDb) {
  await orbitDb.stop()
  await orbitDb.ipfs.stop()
  await orbitDb.ipfs.blockstore.unwrap().unwrap().child.db.close()
}