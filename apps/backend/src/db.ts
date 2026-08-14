import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) throw new Error("MONGODB_URI is not set");
if (!dbName) throw new Error("DB_NAME is not set");

export const client = new MongoClient(uri);
await client.connect();

export const db: Db = client.db(dbName);
