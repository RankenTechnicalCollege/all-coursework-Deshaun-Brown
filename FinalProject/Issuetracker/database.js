import { MongoClient, ObjectId } from 'mongodb';
import debug from 'debug';


const debugDb = debug('app:Database');

const newId = (str) => ObjectId.createFromHexString(str);

const isValidId = (str) => {
  try {
    return ObjectId.isValid(str) && str.length === 24;
  } catch {
    return false;
  }
};

let _db = null;
let _client = null;

async function connect() {
  if (!_db) {
    const dbUrl = process.env.DB_URL || 'mongodb+srv://dezmonmint_db_user:Soultruth1!@cluster0.wxksszc.mongodb.net/';
    const dbName = process.env.DB_NAME || 'IssueTracker';

    if (!dbUrl) throw new Error('DB_URL is not set');
    if (!dbName) throw new Error('DB_NAME is not set');

    const client = new MongoClient(dbUrl);
    await client.connect();
    _client = client;
    _db = client.db(dbName);
    debugDb('Connected to MongoDB');
  }
  return _db;
}

async function getDatabase() {
  return await connect();
}

async function getClient() {
  if (!_client) await connect();
  return _client;
}

async function saveAuditLog(entry) {
  const db = await connect();
  const doc = {
    ...entry,
    timestamp: entry?.timestamp ? new Date(entry.timestamp) : new Date(),
  };
  // Lab expects audit entries in 'edits' collection
  await db.collection('edits').insertOne(doc);
  return doc;
}


/*async function ping(){
    const db = await connect();
    await db.command({ ping: 1 });
    debugDb('Ping.');
} */


export { newId, connect, isValidId, getClient, getDatabase, saveAuditLog};

//ping();
