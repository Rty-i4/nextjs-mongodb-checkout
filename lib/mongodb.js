import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URi env");
}

if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB env");
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  let client = new MongoClient(MONGODB_URI, options);
  await client.connect();
  let db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}
