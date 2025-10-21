import express from 'express';
import debug from 'debug';
import bcrypt from 'bcrypt';
import {connect, newId, isValidId} from '../../database.js';
import joi from 'joi';

/*
MongoDB Indexes required for advanced user search functionality:
Run these commands in MongoDB shell:

use IssueTracker
db.users.createIndex({ "$**": "text" })
db.users.createIndex({ "created": 1 })
db.users.createIndex({ "givenName": 1, "familyName": 1, "created": 1 })
db.users.createIndex({ "familyName": 1, "givenName": 1, "created": 1 })
db.users.createIndex({ "role": 1, "givenName": 1, "familyName": 1, "created": 1 })
*/

const debugUser = debug('app:UserRouter');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

// Define Joi schemas
const registerSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  givenName: joi.string().min(1).required(),
  familyName: joi.string().min(1).required(),
  role: joi.string().valid('admin', 'user', 'developer', 'tester').required()
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
});

const updateSchema = joi.object({
  email: joi.string().email().optional(),
  password: joi.string().min(6).optional(),
  fullName: joi.string().min(1).optional(),
  givenName: joi.string().min(1).optional(),
  familyName: joi.string().min(1).optional(),
  role: joi.string().valid('admin', 'user', 'developer', 'tester').optional()
});


// GET /api/users/- Return users with advanced search and pagination
router.get('/', async (req, res) => {
  try {
    const db = await connect();
    const {
      keywords,
      role,
      maxAge,
      minAge,
      sortBy = 'givenName',
      pageSize = 5,
      pageNumber = 1
    } = req.query;

    const query = {};

    // Keyword search
    if (keywords) {
      query.$text = { $search: keywords };
    }

    // Role filter
    if (role) {
      query.role = role;
    }

    // Age filters (based on created date)
    const now = new Date();
    if (maxAge) {
      const maxDate = new Date(now.getTime() - parseInt(maxAge) * 24 * 60 * 60 * 1000);
      query.created = query.created || {};
      query.created.$gte = maxDate;
    }
    if (minAge) {
      const minDate = new Date(now.getTime() - parseInt(minAge) * 24 * 60 * 60 * 1000);
      query.created = query.created || {};
      query.created.$lt = minDate;
    }

    // Sorting logic
    let sort = {};
    switch (sortBy) {
      case 'familyName':
        sort = { familyName: 1, givenName: 1, created: 1 };
        break;
      case 'role':
        sort = { role: 1, givenName: 1, familyName: 1, created: 1 };
        break;
      case 'newest':
        sort = { created: -1 };
        break;
      case 'oldest':
        sort = { created: 1 };
        break;
      case 'givenName':
      default:
        sort = { givenName: 1, familyName: 1, created: 1 };
        break;
    }

    // Pagination
    const limit = parseInt(pageSize) || 5;
    const skip = (parseInt(pageNumber) - 1) * limit;

    const users = await db.collection('users')
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api users = Return all users as JSON array
router.get('/', async (req, res) => {
  try{
    console.log('GET /api/users called');
    const db = await connect();
    const users = await db.collection('users').find({}).toArray();
    debugUser(`Found ${users.length} users`);
    res.json(users);
  } catch (error){
    debugUser('Error fetching users:',error);
    res.status(500).json({error: 'Internal server error'});
    
  }
});


// GET /api/users/:userId - Return a specific user by ID
router.get('/:userId', async (req, res) => {
  try{
    const { userId} = req.params;
    debugUser(`GET /api/users/${userId} called`);
    
    // Validate ObjectId
    if (!isValidId(userId)) {
      debugUser(`Invalid ObjectId: ${userId}`);
      return res.status(404).json({ error: `userId ${userId} is not a valid ObjectId.` });
    }
  
    const db = await connect();
    const user = await db.collection('users').findOne({_id: newId(userId)});

    if (!user) {
      debugUser(`User ${userId} not found`);
      return res.status(404).json({ error: `User ${userId} not found.`});
    }

    debugUser(`User ${userId} found`);
    res.json(user);
  } catch (error) {
    debugUser('Error fetching user:',error);
    res.status(500).json({ error: 'Internal server error'});
  }
});

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    debugUser('POST /api/users/register called');
    
    // Validate request body with Joi
    const validateResult = registerSchema.validate(req.body);
    if (validateResult.error) {
      debugUser(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const { email, password, givenName, familyName, role } = validateResult.value;
    
    const db = await connect();
    
    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email: email });
    if (existingUser) {
      debugUser(`Email ${email} already registered`);
      return res.status(400).json({ error: "Email already registered." });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = {
      email: email,
      password: hashedPassword,
      givenName: givenName,
      familyName: familyName,
      role: role,
      created: new Date()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    debugUser(`New user registered with ID: ${result.insertedId}`);
    res.status(200).json({ message: "New user registered!", userId: result.insertedId });
  } catch (error) {
    debugUser('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/login - Verify user credentials
router.post('/login', async (req, res) => {
  try {
    debugUser('POST /api/users/login called');
    
    // Validate request body with Joi
    const validateResult = loginSchema.validate(req.body);
    if (validateResult.error) {
      debugUser(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const { email, password } = validateResult.value;
    
    const db = await connect();
    const user = await db.collection('users').findOne({ email: email });
    
    if (!user) {
      debugUser(`User with email ${email} not found`);
      return res.status(400).json({ error: "Invalid login credential provided. Please try again." });
    }
    
    // Compare password with hash
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      debugUser(`User ${email} logged in successfully`);
      res.status(200).json({ message: "Welcome back!", userId: user._id });
    } else {
      debugUser(`Invalid password for user ${email}`);
      res.status(400).json({ error: "Invalid login credential provided. Please try again." });
    }
  } catch (error) {
    debugUser('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/users/:userId - Update existing user
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    debugUser(`PATCH /api/users/${userId} called`);
    
    // Validate ObjectId
    if (!isValidId(userId)) {
      debugUser(`Invalid ObjectId: ${userId}`);
      return res.status(404).json({ error: `userId ${userId} is not a valid ObjectId.` });
    }
    
    // Validate request body with Joi
    const validateResult = updateSchema.validate(req.body);
    if (validateResult.error) {
      debugUser(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const db = await connect();
    const user = await db.collection('users').findOne({ _id: newId(userId) });
    
    if (!user) {
      debugUser(`User ${userId} not found for update`);
      return res.status(404).json({ error: `User ${userId} not found.` });
    }
    
    const { password, fullName, givenName, familyName, role } = validateResult.value;
    const updateFields = {};
    
    if (password) {
      const saltRounds = 10;
      updateFields.password = await bcrypt.hash(password, saltRounds);
    }
    if (fullName) {
      updateFields.fullName = fullName;
    }
    if (givenName) {
      updateFields.givenName = givenName;
    }
    if (familyName) {
      updateFields.familyName = familyName;
    }
    if (role) {
      updateFields.role = role;
    }
    
    updateFields.lastUpdated = new Date();
    
    await db.collection('users').updateOne(
      { _id: newId(userId) },
      { $set: updateFields }
    );
    
    debugUser(`User ${userId} updated`);
    res.status(200).json({ message: `User ${userId} updated!`, userId: userId });
  } catch (error) {
    debugUser('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/:userId - Delete user
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    debugUser(`DELETE /api/users/${userId} called`);
    
    // Validate ObjectId
    if (!isValidId(userId)) {
      debugUser(`Invalid ObjectId: ${userId}`);
      return res.status(404).json({ error: `userId ${userId} is not a valid ObjectId.` });
    }
    
    const db = await connect();
    const user = await db.collection('users').findOne({ _id: newId(userId) });
    
    if (!user) {
      debugUser(`User ${userId} not found for deletion`);
      return res.status(404).json({ error: `User ${userId} not found.` });
    }
    
    await db.collection('users').deleteOne({ _id: newId(userId) });
    debugUser(`User ${userId} deleted`);
    res.status(200).json({ message: `User ${userId} deleted!`, userId: userId });
  } catch (error) {
    debugUser('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as UserRouter };