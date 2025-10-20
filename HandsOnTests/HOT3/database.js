import { MongoClient, ObjectId } from 'mongodb';
import debug from 'debug';

// dotenv is loaded in server.js (nodemon is started with --env-file .env),
// so avoid calling dotenv.config() here to prevent duplicate initialization
// and the 'Identifier "dotenv" has already been declared' error.
const debugDb = debug('app:Database');

let _client = null;

// Connect to MongoDB
async function connect() {
  if (!_client) {
    const dbUrl = process.env.DB_URL || process.env.MONGODB_URI || process.env.DATABASE_URL;
    const dbName = process.env.DB_NAME || process.env.MONGODB_DB || 'Ecommerce';

    if (!dbUrl) throw new Error('Database URL not configured in environment');

    _client = new MongoClient(dbUrl);
    await _client.connect();
    debugDb(`Connected to MongoDB db=${dbName}`);
    return _client.db(dbName);
  }

  const dbName = process.env.DB_NAME || process.env.MONGODB_DB || 'Ecommerce';
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
