import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import debug from 'debug';

dotenv.config(); // Load environment variables

const debugDb = debug('app:Database');

// ✅ Define constants from .env
const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME || 'Ecommerce';

let _client = null;

async function connect() {
  if (!_client) {
    if (!dbUrl) throw new Error('Database URL not configured in environment');
    _client = new MongoClient(dbUrl);
    await _client.connect();
    debugDb(`Connected to MongoDB db=${dbName}`);
  }
  return _client.db(dbName);
}

// Close MongoDB connection
async function close() {
  if (_client) {
    await _client.close();
    _client = null;
    debugDb('MongoDB connection closed');
  }
}

// Ping MongoDB
async function ping() {
  const db = await connect();
  await db.command({ ping: 1 });
  debugDb('Ping successful');
}

// ID helpers
function newId(str) {
  return ObjectId.createFromHexString(str);
}

function isValidId(str) {
  return ObjectId.isValid(str) && str.length === 24;
}

// Collection accessors
async function getProductCollection() {
  const db = await connect();
  return db.collection('products');
}


// Export everything
export {
  connect,
  close,  
  ping,
  newId,
  isValidId,
  getProductCollection,
  ObjectId
};
