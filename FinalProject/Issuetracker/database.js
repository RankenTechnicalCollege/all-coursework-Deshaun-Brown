
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

async function connect() {
    if (!_db) {
        const dbUrl = process.env.DB_URL || 'mongodb+srv://dezmonmint_db_user:Soultruth1!@cluster0.wxksszc.mongodb.net/';
        const dbName = process.env.DB_NAME || 'IssueTracker';
        const client = await MongoClient.connect(dbUrl);
        _db = client.db(dbName);
        debugDb('Connected to MongoDB');
    }
    return _db;
}


/*async function ping(){
    const db = await connect();
    await db.command({ ping: 1 });
    debugDb('Ping.');
} */


export { newId, connect, isValidId};

//ping();
