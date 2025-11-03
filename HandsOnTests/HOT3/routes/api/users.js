import express from 'express';
import Joi from 'joi';
import debug from 'debug';
import { 
  listUsers,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser
} from '../../database.js';
import { auth } from '../../auth.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { hasRole } from '../../middleware/hasRole.js';
import { validId } from '../../middleware/validId.js';

const debugUser = debug('app:UserRouter');
const router = express.Router();

// Joi Validation Schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  role: Joi.string().valid('customer', 'admin').default('customer')
}).required();

const updateSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  name: Joi.string().min(2).optional(),
  role: Joi.string().valid('customer', 'admin').optional()
}).min(1).required();

// PATCH /me schema - accepts fullName, email, password
const meUpdateSchema = Joi.object({
  fullName: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional()
}).min(1).required();

// GET /api/users - List all users (admin only)
router.get('/', hasRole('admin'), async (req, res) => {
  try {
    debugUser('GET /api/users called');
    const users = await listUsers(true); // Include passwords
    debugUser(`Found ${users.length} users`);
    res.status(200).json(users);
  } catch (error) {
    debugUser('Error listing users:', error);
    res.status(500).json({ 
      message: 'Failed to list users',
      error: error.message 
    });
  }
});

// GET /api/users/me - Get current user's profile
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    debugUser('GET /api/users/me called');
    const user = await findUserByEmail(req.user.email, true); // Include password

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    debugUser('Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile',
      error: error.message 
    });
  }
});

// GET /api/users/:userId - Get user by ID (admin only)
router.get('/:userId', isAuthenticated, hasRole('admin'), validId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    debugUser(`GET /api/users/${userId} called`);
    
    const user = await findUserById(userId, true); // Include password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    debugUser('Error fetching user:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user',
      error: error.message 
    });
  }
});

// PATCH /api/users/me - Update current user (accepts fullName, email, password)
router.patch('/me', isAuthenticated, async (req, res) => {
  try {
    debugUser('PATCH /api/users/me called');

    // Validate with meUpdateSchema (fullName, email, password only)
    const { error, value } = meUpdateSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      return res.status(400).json({ 
        message: 'Validation failed',
        details: error.details.map(d => ({
          message: d.message,
          path: d.path
        }))
      });
    }

    // Map fullName to name for database storage
    const { fullName, ...rest } = value;
    const updateData = {
      ...rest,
      ...(fullName ? { name: fullName } : {}),
      lastUpdatedOn: new Date()
    };

    const userId = req.user?.id;
    const result = await updateUser(userId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'Profile updated successfully',
      userId 
    });
  } catch (error) {
    debugUser('Error updating profile:', error);
    res.status(500).json({ 
      message: 'Failed to update profile',
      error: error.message 
    });
  }
});

// POST /api/users/register - Register new user
router.post('/register', async (req, res) => {
  try {
    debugUser('POST /api/users/register called');
    
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation failed',
        details: error.details 
      });
    }

    // Forward to Better Auth for registration
    return res.redirect(307, '/api/auth/sign-up/email');
  } catch (error) {
    debugUser('Error registering user:', error);
    res.status(500).json({ 
      message: 'Failed to register user',
      error: error.message 
    });
  }
});

// POST /api/auth/login - Login user
router.post('/sign-up', async (req, res) => {
  try {
    debugUser('POST /api/auth/sign-up called');

    // Forward to Better Auth for sign-up
    return res.redirect(307, '/api/auth/sign-up/email');
  } catch (error) {
    debugUser('Error signing up:', error);
    res.status(500).json({ 
      message: 'Failed to sign up',
      error: error.message 
    });
  }
});

// PATCH /api/users/:id - Update user
router.patch('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    debugUser(`PATCH /api/users/${id} called`);

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation failed',
        details: error.details 
      });
    }

    const result = await updateUser(id, value);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'User updated successfully',
      userId: id 
    });
  } catch (error) {
    debugUser('Error updating user:', error);
    res.status(500).json({ 
      message: 'Failed to update user',
      error: error.message 
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    debugUser(`DELETE /api/users/${id} called`);

    const result = await deleteUser(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'User deleted successfully',
      userId: id 
    });
  } catch (error) {
    debugUser('Error deleting user:', error);
    res.status(500).json({ 
      message: 'Failed to delete user',
      error: error.message 
    });
  }
});

export default router;
