import { Libp2p2Options } from "@/config/libp2p";
import { createLibp2p } from "libp2p";
import { createHelia } from "helia";
import { createOrbitDB } from "@orbitdb/core";
import { LevelBlockstore } from "blockstore-level";


export class DB {

  constructor() {
    this.blockstore = new LevelBlockstore('./ipfs/blocks');
    this.libp2p = createLibp2p(Libp2p2Options);
    this.ipfs = createHelia(this.libp2p, this.blockstore);

    this.orbitdb = createOrbitDB({ ipfs });
  }


  async connect() {
    
  }
}