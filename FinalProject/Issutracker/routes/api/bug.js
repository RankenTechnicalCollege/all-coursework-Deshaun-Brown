import express from 'express';
import debug from 'debug';
import { connect, newId } from '../../database.js';

const debugBug = debug('app:BugRouter');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

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
    const { title, description, stepsToReproduce } = req.body;
    
    // Validate required fields
    const invalid = [];
    if (!title || typeof title !== 'string' || !title.trim()) invalid.push('title');
    if (!description || typeof description !== 'string' || !description.trim()) invalid.push('description');
    if (!stepsToReproduce || typeof stepsToReproduce !== 'string' || !stepsToReproduce.trim()) invalid.push('stepsToReproduce');
    
    if (invalid.length > 0) {
      debugBug(`Invalid fields: ${invalid.join(', ')}`);
      return res.status(400).json({ error: `Invalid or missing: ${invalid.join(', ')}` });
    }
    
    const db = await connect();
    
    // Create new bug
    const newBug = {
      title: title.trim(),
      description: description.trim(),
      stepsToReproduce: stepsToReproduce.trim(),
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
    
    const db = await connect();
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    
    if (!bug) {
      debugBug(`Bug ${bugId} not found for update`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    const { title, description, stepsToReproduce } = req.body;
    const updateFields = {};
    
    if (title && typeof title === 'string' && title.trim()) {
      updateFields.title = title.trim();
    }
    if (description && typeof description === 'string' && description.trim()) {
      updateFields.description = description.trim();
    }
    if (stepsToReproduce && typeof stepsToReproduce === 'string' && stepsToReproduce.trim()) {
      updateFields.stepsToReproduce = stepsToReproduce.trim();
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


// PATCH /api/bugs/:bugId/classify - Update bug classification
router.patch('/:bugId/classify', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugBug(`PATCH /api/bugs/${bugId}/classify called`);
    
    const { classification } = req.body;
    
    if (!classification || typeof classification !== 'string' || !classification.trim()) {
      debugBug('Invalid classification provided');
      return res.status(400).json({ error: 'Invalid or missing: classification' });
    }
    
    const db = await connect();
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    
    if (!bug) {
      debugBug(`Bug ${bugId} not found for classification`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    const updateFields = {
      classification: classification.trim(),
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
    
    const { assignedToUserId, assignedToUserName } = req.body;
    
    const invalid = [];
    if (!assignedToUserId || typeof assignedToUserId !== 'string' || !assignedToUserId.trim()) invalid.push('assignedToUserId');
    if (!assignedToUserName || typeof assignedToUserName !== 'string' || !assignedToUserName.trim()) invalid.push('assignedToUserName');
    
    if (invalid.length > 0) {
      debugBug(`Invalid fields: ${invalid.join(', ')}`);
      return res.status(400).json({ error: `Invalid or missing: ${invalid.join(', ')}` });
    }
    
    const db = await connect();
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    
    if (!bug) {
      debugBug(`Bug ${bugId} not found for assignment`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    const updateFields = {
      assignedToUserId: assignedToUserId.trim(),
      assignedToUserName: assignedToUserName.trim(),
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

    const { closed } = req.body;
    
    if (closed === undefined || typeof closed !== 'boolean') {
      debugBug('Invalid closed value provided');
      return res.status(400).json({ error: 'Invalid or missing: closed (must be boolean)' });
    }
    
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