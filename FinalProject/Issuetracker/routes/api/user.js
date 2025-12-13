import express from 'express';
import debug from 'debug';
import bcrypt from 'bcrypt';
import axios from 'axios';
import {connect, newId, isValidId, saveAuditLog} from '../../database.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { requirePermission } from '../../middleware/roles.js';
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
  name: joi.string().required(),
  role: joi.string().required()
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
  role: joi.alternatives().try(
    joi.string(),
    joi.array().items(joi.string())
  ).optional()
});


router.patch('/me', isAuthenticated, async (req, res) => {
  try {
    debugUser('PATCH /api/users/me called');
    const db = await connect();
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const validateResult = updateSchema.validate(req.body);
    if (validateResult.error) {
      debugUser(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }

  const { password, fullName, givenName, familyName, role } = validateResult.value;
  
  // Step 5: Do not allow the user to change their own role
  if (role !== undefined) {
    debugUser('User attempted to change own role - forbidden');
    return res.status(403).json({ error: 'Forbidden: cannot change your own role' });
  }
  
  const updateFields = {};

    if (password) {
      const saltRounds = 10;
      updateFields.password = await bcrypt.hash(password, saltRounds);
    }
    if (fullName) updateFields.fullName = fullName;
    if (givenName) updateFields.givenName = givenName;
    if (familyName) updateFields.familyName = familyName;

  // Lab-required audit fields
  updateFields.lastUpdatedOn = new Date();
  updateFields.lastUpdatedBy = req.user?.email || 'unknown';

    await db.collection('users').updateOne(
      { _id: newId(userId) },
      { $set: updateFields }
    );

    try {
      await saveAuditLog({
        col: 'user',
        op: 'update',
        target: { userId },
        update: updateFields, // include changed fields and their new values
        auth: req.user, // include full auth context per lab spec
      });
    } catch {}

    // Note: Re-issuing token is handled by Better Auth endpoints. Here we simply respond success.
    return res.status(200).json({ message: 'Profile updated' });
  } catch (error) {
    debugUser('Error updating own profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/me - Return current user's profile (requires auth)
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    debugUser('GET /api/users/me called');
    const db = await connect();
    const userId = req.user?.id;
    const email = req.user?.email;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Try by ObjectId when valid, else fall back to email
    let user = null;
    if (isValidId(userId)) {
      user = await db.collection('users').findOne({ _id: newId(userId) }, { projection: { password: 0 } });
    }
    if (!user && email) {
      user = await db.collection('users').findOne({ email }, { projection: { password: 0 } });
    }

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    debugUser('Error in /me:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users - Return users with advanced search and pagination (canViewData required)
router.get('/', isAuthenticated, requirePermission('canViewData'), async (req, res) => {
  try {
    debugUser('GET /api/users called');
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
      .find(query, { projection: { password: 0 } })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    debugUser(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    debugUser('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:userId - Return a specific user by ID
router.get('/:userId', isAuthenticated, requirePermission('canViewData'), async (req, res) => {
  try{
    const { userId} = req.params;
    debugUser(`GET /api/users/${userId} called`);
    
    // Validate ObjectId
    if (!isValidId(userId)) {
      debugUser(`Invalid ObjectId: ${userId}`);
      return res.status(404).json({ error: `userId ${userId} is not a valid ObjectId.` });
    }
  
    const db = await connect();
    const user = await db.collection('users').findOne(
      { _id: newId(userId) },
      { projection: { password: 0 } }
    );

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

// POST /api/users/sign-up/email - Create new user with hashed password
/**
 * Helper to update user role after signup
 * @param {string} email - User's email address
 * @param {string} role - User role code (DEV, QA, BA, PM, TM)
 * @param {string} fullName - User's full name
 * @returns {Promise<boolean>} True if update succeeded
 */
async function updateUserRoleAfterSignup(email, role, fullName) {
  try {
    const db = await connect();
    const userRole = role || 'DEV';
    
    debugUser(`Updating user ${email} with role: ${userRole}`);
    
    const result = await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          role: userRole,
          fullName: fullName || email,
          updatedAt: new Date()
        }
      }
    );
    
    debugUser(`Updated user ${email}: matched=${result.matchedCount}, modified=${result.modifiedCount}`);
    
    // Verify the update
    const verifyUser = await db.collection('users').findOne({ email });
    debugUser(`Verification - User ${email} now has role: ${verifyUser?.role}`);
    
    return result.modifiedCount > 0;
  } catch (err) {
    debugUser('Error updating user role:', err);
    return false;
  }
}

// Override Better Auth's sign-up to capture role
router.post('/sign-up/email', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    debugUser('POST /api/users/sign-up/email called with:', { email, name, role });

    // Validate input using the registerSchema
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      debugUser(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Forward to Better Auth for actual authentication and user creation (axios)
    const authUrl = process.env.BETTER_AUTH_URL
      || `http://localhost:${process.env.PORT || 8080}/api/auth/sign-up/email`;

    const authRes = await axios.post(authUrl, {
      email: value.email,
      password: value.password,
      name: value.name,
      role: value.role,
    }, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: status => status < 500, // surface 4xx as handled responses
    });

    if (authRes.status >= 400) {
      debugUser('Better Auth sign-up failed:', authRes.data);
      return res.status(authRes.status).json(authRes.data);
    }

    // Now update the user with role and additional fields
    const userRole = value.role || 'DEV';
    const updated = await updateUserRoleAfterSignup(value.email, userRole, value.name);
    
    if (!updated) {
      debugUser(`Warning: Could not update role for ${value.email}`);
    }

    // Fetch the created user to log the hashed password
    const db = await connect();
    const createdUser = await db.collection('users').findOne({ email: value.email });
    if (createdUser) {
      console.log(`[HASHED PASSWORD] User: ${createdUser.email}`);
      console.log(`[HASHED PASSWORD] Password Hash: ${createdUser.password}`);
      console.log(`[HASHED PASSWORD] Role: ${createdUser.role}`);
    }

    debugUser(`User ${value.email} created successfully with role ${userRole}`);

    // Return success
    res.status(201).json({
      message: "User created successfully",
      data: {
        email: value.email,
        fullName: value.name,
        role: userRole
      }
    });
  } catch (err) {
    debugUser('Error in sign-up:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/sign-in/email - Validate and forward to Better Auth
router.post('/sign-in/email', async (req, res) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/auth/sign-in/email',
      req.body,
      { headers: { origin: req.headers.origin } }
    );

    // Forward Better Auth’s response back to the client
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
    });
  }
});


// POST /api/users/sign-out - forward to Better Auth sign-out to clear cookie
router.post('/sign-out', (req, res) => {
  return res.redirect(307, '/api/auth/sign-out');
});

// PATCH /api/users/:userId - Update existing user
router.patch('/:userId', isAuthenticated, requirePermission('canEditAnyUser'), async (req, res) => {
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
    
  // Lab-required audit fields
  updateFields.lastUpdatedOn = new Date();
  updateFields.lastUpdatedBy = req.user?.email || 'unknown';
    
    await db.collection('users').updateOne(
      { _id: newId(userId) },
      { $set: updateFields }
    );
    
    debugUser(`User ${userId} updated`);
    // Audit log
    try {
      await saveAuditLog({
        col: 'user',
        op: 'update',
        target: { userId },
        update: updateFields,
        auth: req.user,
      });
    } catch {}
    res.status(200).json({ message: `User ${userId} updated!`, userId: userId });
  } catch (error) {
    debugUser('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/:userId - Delete user
router.delete('/:userId', isAuthenticated, requirePermission('canEditAnyUser'), async (req, res) => {
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
    // Audit log
    try {
      await saveAuditLog({
        col: 'user',
        op: 'delete',
        target: { userId },
        auth: req.user,
      });
    } catch {}
    res.status(200).json({ message: `User ${userId} deleted!`, userId: userId });
  } catch (error) {
    debugUser('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as UserRouter };