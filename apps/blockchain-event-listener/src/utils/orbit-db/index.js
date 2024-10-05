import { Libp2p2Options } from "@/config/libp2p";
import { createLibp2p } from "libp2p";
import { createHelia } from "helia";
import { createOrbitDB, Documents, IPFSAccessController } from "@orbitdb/core";
import { LevelBlockstore } from "blockstore-level";
import { bitswap } from '@helia/block-brokers';

export const startOrbitDB = async ({ id, identity, identities, directory } = {}) => {
  const options = Libp2p2Options;
  const libp2p = await createLibp2p({ ...options })
  directory = directory || '.'
  const blockstore = new LevelBlockstore(`${directory}/ipfs/blocks`)
  const ipfs = await createHelia({ libp2p, blockstore, blockBrokers: [bitswap()] })
  const orbitdb = await createOrbitDB({ ipfs, id, identity, identities, directory })
  return orbitdb
}


export const connectOrbitDatabase = async ({dbName, type, indexBy, address} = {}) => {
  const orbitdb = await startOrbitDB()
  if (address) {
    const db = await orbitdb.open(address)
    return {db, orbitdb}
  } else {
    console.log('Creating new database');
    const db = await orbitdb.open(dbName, {type, Database: Documents({indexBy}),  AccessController: IPFSAccessController({ write: ['*'] })})
    return {db, orbitdb}
  }
}


export const stopOrbitDB = async (orbitdb) => {
  await orbitdb.stop()
  await orbitdb.ipfs.stop()
  await orbitdb.ipfs.blockstore.unwrap().unwrap().child.db.close()
}