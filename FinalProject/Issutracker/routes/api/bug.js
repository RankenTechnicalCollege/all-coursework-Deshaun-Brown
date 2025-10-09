import express from 'express';
import debug from 'debug';
import { connect, newId, isValidId } from '../../database.js';
import joi from 'joi';

const debugBug = debug('app:BugRouter');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Define Joi schemas
const createBugSchema = joi.object({
  title: joi.string().min(1).required(),
  description: joi.string().min(1).required(),
  stepsToReproduce: joi.string().min(1).required()
});

const updateBugSchema = joi.object({
  title: joi.string().min(1).optional(),
  description: joi.string().min(1).optional(),
  stepsToReproduce: joi.string().min(1).optional()
});

const classifySchema = joi.object({
  classification: joi.string().valid('bug', 'feature', 'enhancement', 'documentation', 'duplicate', 'invalid','Validation').required()
});

const assignSchema = joi.object({
  assignedToUserId: joi.string().required(),
  assignedToUserName: joi.string().min(1).required()
});

const closeSchema = joi.object({
  closed: joi.boolean().required()
});

// GET /api/bugs - Return all bugs as JSON array
router.get('/', async (req, res) => {
  try {
    debugBug('GET /api/bugs called');
    const db = await connect();
    const bugs = await db.collection('bugs').find({}).toArray();
    debugBug(`Found ${bugs.length} bugs`);
    res.json(bugs);
  } catch (error) {
    debugBug('Error fetching bugs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api/bugs/:bugId - Return a specific bug by ID
router.get('/:bugId', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugBug(`GET /api/bugs/${bugId} called`);
    
    // Validate ObjectId
    if (!isValidId(bugId)) {
      debugBug(`Invalid ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    const db = await connect();
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    
    if (!bug) {
      debugBug(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    debugBug(`Bug ${bugId} found`);
    res.json(bug);
  } catch (error) {
    debugBug('Error fetching bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/bugs - Create a new bug
router.post('/', async (req, res) => {
  try {
    debugBug('POST /api/bugs called');
    
    // Validate request body with Joi
    const validateResult = createBugSchema.validate(req.body);
    if (validateResult.error) {
      debugBug(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const { title, description, stepsToReproduce } = validateResult.value;
    
    const db = await connect();
    
    // Create new bug
    const newBug = {
      title: title,
      description: description,
      stepsToReproduce: stepsToReproduce,
      createdAt: new Date(),
      closed: false
    };
    
    const result = await db.collection('bugs').insertOne(newBug);
    debugBug(`New bug created with ID: ${result.insertedId}`);
    res.status(200).json({ message: "New bug reported!", bugId: result.insertedId });
  } catch (error) {
    debugBug('Error creating bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PATCH /api/bugs/:bugId - Update existing bug
router.patch('/:bugId', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugBug(`PATCH /api/bugs/${bugId} called`);
    
    // Validate ObjectId
    if (!isValidId(bugId)) {
      debugBug(`Invalid ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    // Validate request body with Joi
    const validateResult = updateBugSchema.validate(req.body);
    if (validateResult.error) {
      debugBug(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const db = await connect();
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    
    if (!bug) {
      debugBug(`Bug ${bugId} not found for update`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    const { title, description, stepsToReproduce } = validateResult.value;
    const updateFields = {};
    
    if (title) {
      updateFields.title = title;
    }
    if (description) {
      updateFields.description = description;
    }
    if (stepsToReproduce) {
      updateFields.stepsToReproduce = stepsToReproduce;
    }
    
    updateFields.lastUpdated = new Date();
    
    await db.collection('bugs').updateOne(
      { _id: newId(bugId) },
      { $set: updateFields }
    );
    
    debugBug(`Bug ${bugId} updated`);
    res.status(200).json({ message: `Bug ${bugId} updated!`, bugId: bugId });
  } catch (error) {
    debugBug('Error updating bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PATCH /api/bugs/:bugId/classification - Update bug classification
router.patch('/:bugId/classification', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugBug(`PATCH /api/bugs/${bugId}/classification called`);
    
    // Validate ObjectId
    if (!isValidId(bugId)) {
      debugBug(`Invalid ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    // Validate request body with Joi
    const validateResult = classifySchema.validate(req.body);
    if (validateResult.error) {
      debugBug(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const { classification } = validateResult.value;
    
    const db = await connect();
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    
    if (!bug) {
      debugBug(`Bug ${bugId} not found for classification`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    const updateFields = {
      classification: classification,
      classifiedOn: new Date(),
      lastUpdated: new Date()
    };
    
    await db.collection('bugs').updateOne(
      { _id: newId(bugId) },
      { $set: updateFields }
    );
    
    debugBug(`Bug ${bugId} classified`);
    res.status(200).json({ message: `Bug ${bugId} classified!`, bugId: bugId });
  } catch (error) {
    debugBug('Error classifying bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PATCH /api/bugs/:bugId/assign - Assign bug to user
router.patch('/:bugId/assign', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugBug(`PATCH /api/bugs/${bugId}/assign called`);
    
    // Validate ObjectId
    if (!isValidId(bugId)) {
      debugBug(`Invalid ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    // Validate request body with Joi
    const validateResult = assignSchema.validate(req.body);
    if (validateResult.error) {
      debugBug(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const { assignedToUserId, assignedToUserName } = validateResult.value;
    
    const db = await connect();
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    
    if (!bug) {
      debugBug(`Bug ${bugId} not found for assignment`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    const updateFields = {
      assignedToUserId: assignedToUserId,
      assignedToUserName: assignedToUserName,
      assignedOn: new Date(),
      lastUpdated: new Date()
    };
    
    await db.collection('bugs').updateOne(
      { _id: newId(bugId) },
      { $set: updateFields }
    );
    
    debugBug(`Bug ${bugId} assigned`);
    res.status(200).json({ message: `Bug ${bugId} assigned!`, bugId: bugId });
  } catch (error) {
    debugBug('Error assigning bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PATCH /api/bugs/:bugId/close - Close bug
router.patch('/:bugId/close', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugBug(`PATCH /api/bugs/${bugId}/close called`);
    
    // Validate ObjectId
    if (!isValidId(bugId)) {
      debugBug(`Invalid ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    // Validate request body with Joi
    const validateResult = closeSchema.validate(req.body);
    if (validateResult.error) {
      debugBug(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const { closed } = validateResult.value;
    
    const db = await connect();
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    
    if (!bug) {
      debugBug(`Bug ${bugId} not found for closing`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    const updateFields = {
      closed: closed,
      lastUpdated: new Date()
    };
    
    if (closed) {
      updateFields.closedOn = new Date();
    } else {
      updateFields.closedOn = null;
    }
    
    await db.collection('bugs').updateOne(
      { _id: newId(bugId) },
      { $set: updateFields }
    );
    
    debugBug(`Bug ${bugId} closed status updated`);
    res.status(200).json({ message: `Bug ${bugId} closed!`, bugId: bugId });
  } catch (error) {
    debugBug('Error closing bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as BugRouter };