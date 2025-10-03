import express from 'express';
import debug from 'debug';
import bcrypt from 'bcrypt';
import {connect, newId} from '../../database.js';


const debugUser = debug('app:UserRouter');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));


// GET /api/users - Return all users as JSON array
router.get('/', async (req, res) =>{
  try{debugUser('GET/api/users called');
    const db = await connect();
    const users = await db.collection('users').find({}).toArray();
    debugUser(`Found ${users.length} users`);
    res.json(users);
  }catch (error){
    debugUser('Error fetching users:', error);
    res.status(500).json({ error:'Internal server error'});
  }
});

// GET /api users = Return all users as JSON array
router.get('/', async (req, res) => {
  try{
    debugUser('GET /api/users called');
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
    const { email, password, fullName, givenName, familyName, role } = req.body;
    
    // Validate required fields
    const invalid = [];
    if (!email || typeof email !== 'string' || !email.trim()) invalid.push('email');
    if (!password || typeof password !== 'string' || !password.trim()) invalid.push('password');
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) invalid.push('fullName');
    if (!givenName || typeof givenName !== 'string' || !givenName.trim()) invalid.push('givenName');
    if (!familyName || typeof familyName !== 'string' || !familyName.trim()) invalid.push('familyName');
    if (!role || typeof role !== 'string' || !role.trim()) invalid.push('role');
    
    if (invalid.length > 0) {
      debugUser(`Invalid fields: ${invalid.join(', ')}`);
      return res.status(400).json({ error: `Invalid or missing: ${invalid.join(', ')}` });
    }
    
    const db = await connect();
    
    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email: email.trim() });
    if (existingUser) {
      debugUser(`Email ${email} already registered`);
      return res.status(400).json({ error: "Email already registered." });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);
    
    // Create new user
    const newUser = {
      email: email.trim(),
      password: hashedPassword,
      fullName: fullName.trim(),
      givenName: givenName.trim(),
      familyName: familyName.trim(),
      role: role.trim(),
      createdAt: new Date()
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
    const { email, password } = req.body;
    
    if (!email || !password) {
      debugUser('Missing email or password');
      return res.status(400).json({ error: "Please enter your login credentials." });
    }
    
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
    
    const db = await connect();
    const user = await db.collection('users').findOne({ _id: newId(userId) });
    
    if (!user) {
      debugUser(`User ${userId} not found for update`);
      return res.status(404).json({ error: `User ${userId} not found.` });
    }
    
    const { password, fullName, givenName, familyName, role } = req.body;
    const updateFields = {};
    
    if (password && typeof password === 'string' && password.trim()) {
      const saltRounds = 10;
      updateFields.password = await bcrypt.hash(password.trim(), saltRounds);
    }
    if (fullName && typeof fullName === 'string' && fullName.trim()) {
      updateFields.fullName = fullName.trim();
    }
    if (givenName && typeof givenName === 'string' && givenName.trim()) {
      updateFields.givenName = givenName.trim();
    }
    if (familyName && typeof familyName === 'string' && familyName.trim()) {
      updateFields.familyName = familyName.trim();
    }
    if (role && typeof role === 'string' && role.trim()) {
      updateFields.role = role.trim();
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