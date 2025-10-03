import * as dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import debug from 'debug';


dotenv.config();

const debugDb = debug('app:Database');

const newId = (str) => ObjectId.createFromHexString(str);

let _db = null;

async function connect() {
    if (!_db) {
        const dbUrl = process.env.DB_URL;
        const dbName = process.env.DB_NAME || 'IssueTracker';
        const client = await MongoClient.connect(dbUrl);
        _db = client.db(dbName);
        debugDb('Connected to MongoDB');
    }
    return _db;
}

async function ping(){
    const db = await connect();
    await db.command({ ping: 1 });
    debugDb('Ping.');
}


export { newId, connect, ping};

ping();
