import { MongoClient, ObjectId } from 'mongodb';
import debug from 'debug';

const debugDb = debug('app:Database');

// Environment configuration
const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME || 'Ecommerce';

let _client = null;

/**
 * Connects to MongoDB and returns database instance
 * @returns {Promise<import('mongodb').Db>} MongoDB database instance
 * @throws {Error} If database URL is not configured or connection fails
 */
const connect = async () => {
  try {
    if (!_client) {
      if (!dbUrl) {
        throw new Error('Database URL not configured in environment');
      }
      _client = new MongoClient(dbUrl);
      await _client.connect();
      debugDb(`Connected to MongoDB database: ${dbName}`);
    }
    return _client.db(dbName);
  } 
  catch (error) {
    debugDb(`Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
}

/**
 * Gets the MongoDB client instance
 * @returns {Promise<MongoClient>} MongoDB client instance
 */
const getClient = async () => {
  if (!_client) await connect();
  return _client;
};

/**
 * Gets the MongoDB database instance
 * @returns {Promise<import('mongodb').Db>} MongoDB database instance
 */
const getDatabase = async () => {
  return await connect();
};

/**
 * Closes the MongoDB connection
 * @returns {Promise<void>}
 */
const close = async () => {
  if (_client) {
    try {
      await _client.close();
      _client = null;
      debugDb('MongoDB connection closed');
    } catch (error) {
      debugDb(`Failed to close MongoDB connection: ${error.message}`);
      throw error;
    }
  }
};

/**
 * Pings the MongoDB server to verify connection
 * @returns {Promise<void>}
 * @throws {Error} If ping fails
 */
const ping = async () => {
  try {
    const db = await connect();
    await db.command({ ping: 1 });
    debugDb('MongoDB ping successful');
  } catch (error) {
    debugDb(`MongoDB ping failed: ${error.message}`);
    throw error;
  }
};

/**
 * Creates an ObjectId from a string
 * @param {string} str - Hex string to convert
 * @returns {ObjectId} MongoDB ObjectId
 */
const newId = (str) => ObjectId.createFromHexString(str);

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} str - String to validate
 * @returns {boolean} True if valid ObjectId
 */
const isValidId = (str) => ObjectId.isValid(str) && str.length === 24;

/**
 * Gets the products collection
 * @returns {Promise<import('mongodb').Collection>} Products collection
 */
const getProductCollection = async () => {
  const db = await connect();
  const collection = db.collection('products');
  
  // Ensure unique index on name field
  await collection.createIndex({ name: 1 }, { unique: true });
  
  return collection;
};

/**
 * Search products with filters and sorting
 * @param {Object} options Search options
 * @param {string} [options.keywords] Search keywords
 * @param {string} [options.category] Product category
 * @param {number} [options.maxPrice] Maximum price
 * @param {number} [options.minPrice] Minimum price
 * @param {string} [options.sortBy=name] Sort mode (name|category|lowestPrice|newest)
 * @param {number} [options.pageSize=5] Items per page
 * @param {number} [options.pageNumber=1] Page number
 * @returns {Promise<Array>} Array of matching products
 */
const searchProducts = async ({
  keywords,
  category,
  maxPrice,
  minPrice,
  sortBy = 'name',
  pageSize = 5,
  pageNumber = 1
}) => {
  const collection = await getProductCollection();
  const query = {};

  // Build query filters
  if (keywords) {
    query.name = { $regex: keywords, $options: 'i' };
  }
  if (category) {
    query.category = category;
  }
  if (maxPrice || minPrice) {
    query.price = {};
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    if (minPrice) query.price.$gte = parseFloat(minPrice);
  }

  // Define sort order based on sortBy parameter
  const sortOptions = {
    name: { name: 1 },
    category: { category: 1, name: 1 },
    lowestPrice: { price: 1, name: 1 },
    newest: { createdAt: -1, name: 1 }
  };

  const sort = sortOptions[sortBy] || sortOptions.name;

  // Calculate pagination
  const skip = (parseInt(pageNumber) - 1) * parseInt(pageSize);
  const limit = parseInt(pageSize);

  debugDb('Searching products with query:', {
    query,
    sort,
    skip,
    limit
  });

  return collection
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
};

/**
 * Gets the users collection
 * @returns {Promise<import('mongodb').Collection>} Users collection
 */
const getUsersCollection = async () => {
  const db = await connect();
  return db.collection('users');
};

/**
 * List all users
 * @param {boolean} includePassword - Whether to include password in results
 * @returns {Promise<Array>} Array of users
 */
const listUsers = async (includePassword = true) => {
  const collection = await getUsersCollection();
  return collection
    .find({})
    .project(includePassword ? {} : { password: 0 })
    .toArray();
};

/**
 * Find user by email
 * @param {string} email - User's email
 * @param {boolean} includePassword - Whether to include password in result
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserByEmail = async (email, includePassword = false) => {
  const collection = await getUsersCollection();
  return collection.findOne(
    { email },
    { projection: includePassword ? {} : { password: 0 } }
  );
};

/**
 * Find user by ID
 * @param {string} id - User's ID
 * @param {boolean} includePassword - Whether to include password in result
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserById = async (id, includePassword = false) => {
  const collection = await getUsersCollection();
  return collection.findOne(
    { _id: new ObjectId(id) },
    { projection: includePassword ? {} : { password: 0 } }
  );
};

/**
 * Update user by ID
 * @param {string} id - User's ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Update result
 */
const updateUser = async (id, updateData) => {
  const collection = await getUsersCollection();
  return collection.updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...updateData,
        lastUpdatedOn: new Date()
      }
    }
  );
};

/**
 * Delete user by ID
 * @param {string} id - User's ID
 * @returns {Promise<Object>} Delete result
 */
const deleteUser = async (id) => {
  const collection = await getUsersCollection();
  return collection.deleteOne({ _id: new ObjectId(id) });
};

export {
  connect,
  close,
  ping,
  newId,
  isValidId,
  getProductCollection,
  getUsersCollection,
  listUsers,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  ObjectId,
  getClient,
  getDatabase,
  searchProducts
};
