import { Db, MongoClient } from "mongodb";

export class MongoDatabase {
  private client: MongoClient;
  private db: Db;

  constructor(mongoUri: string, dbName: string) {
    this.client = new MongoClient(mongoUri);
    this.db = this.client.db(dbName);
  }

  getClient() {
    return this.client;
  }

  getDb() {
    return this.db;
  }
}
