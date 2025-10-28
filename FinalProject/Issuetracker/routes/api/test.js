import express from 'express';
import debug from 'debug';
import { connect, newId, isValidId, saveAuditLog } from '../../database.js';
import joi from 'joi';

const debugTest = debug('app:TestRouter');
const router = express.Router({ mergeParams: true }); // mergeParams to access :bugId

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Define Joi schemas
const createTestSchema = joi.object({
  testName: joi.string().min(1).required(),
  testDescription: joi.string().min(1).required(),
  passed: joi.boolean().required()
});

const updateTestSchema = joi.object({
  testDescription: joi.string().min(1).optional(),
  passed: joi.boolean().required(),
  testName: joi.string().min(1).optional()
});

// GET /api/bugs/:bugId/testCases - Get all test cases for a bug (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugTest(`GET /api/bugs/${bugId}/testCases called`);
    
    // Validate bugId
    if (!isValidId(bugId)) {
      debugTest(`Invalid ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    const db = await connect();
    
    // Check if bug exists
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugTest(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    // Return the testCases array (or empty array if no test cases)
    const testCases = bug.testCases || [];
    debugTest(`Found ${testCases.length} test cases for bug ${bugId}`);

    res.json(testCases);
  } catch (error) {
    debugTest('Error fetching test cases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bugs/:bugId/tests/:testId - Get specific test case by index
router.get('/:testId', async (req, res) => {
  try {
    const { bugId, testId } = req.params;
    debugTest(`GET /api/bugs/${bugId}/tests/${testId} called`);
    
    // Validate bugId ObjectId
    if (!isValidId(bugId)) {
      debugTest(`Invalid bugId ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    const db = await connect();
    
    // Check if bug exists
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugTest(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    // Get specific test case by index (testId as array index)
    const testCases = bug.testCases || [];
    const testIndex = parseInt(testId);

    if (isNaN(testIndex) || testIndex < 0 || testIndex >= testCases.length) {
      debugTest(`Test ${testId} not found for bug ${bugId}`);
      return res.status(404).json({ error: `Test ${testId} not found.` });
    }

    const test = testCases[testIndex];
    debugTest(`Test at index ${testId} found`);
    res.json(test);
  } catch (error) {
    debugTest('Error fetching test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
     

// POST /api/bugs/:bugId/testCases - Create new test case
router.post('/', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugTest(`POST /api/bugs/${bugId}/testCases called`);
    
    // Validate bugId
    if (!isValidId(bugId)) {
      debugTest(`Invalid ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    // Validate request body with Joi
    const validateResult = createTestSchema.validate(req.body);
    if (validateResult.error) {
      debugTest(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const { testName, testDescription, passed } = validateResult.value;
    
    const db = await connect();
    
    // Check if bug exists
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugTest(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    // Create new test case object with lab-required fields
    const newTest = {
      testName,
      testDescription,
      passed,
      createdOn: new Date(),
      createdBy: req.user?.email || 'unknown'
    };
    
    // Add test case to the bug's testCases array
    await db.collection('bugs').updateOne(
      { _id: newId(bugId) },
      { $push: { testCases: newTest } }
    );
    
    debugTest(`New test case added to bug ${bugId}`);
    
    // Lab-required audit log
    try {
      await saveAuditLog({
        col: 'test',
        op: 'insert',
        target: { bugId },
        update: newTest,
        performedBy: req.user?.email || 'unknown'
      });
    } catch {}

    res.status(200).json({ 
      message: "Test case created successfully!", 
      testCase: newTest
    });
  } catch (error) {
    debugTest('Error creating test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/bugs/:bugId/testCases/:testId - Update test case by index
router.patch('/:testId', async (req, res) => {
  try {
    const { bugId, testId } = req.params;
    debugTest(`PATCH /api/bugs/${bugId}/testCases/${testId} called`);
    
    // Validate bugId ObjectId
    if (!isValidId(bugId)) {
      debugTest(`Invalid bugId ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    // Validate request body with Joi
    const validateResult = updateTestSchema.validate(req.body);
    if (validateResult.error) {
      debugTest(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }
    
    const db = await connect();
    
    // Check if bug exists
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugTest(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    // Validate testId as array index
    const testIndex = parseInt(testId);
    const testCases = bug.testCases || [];
    
    if (isNaN(testIndex) || testIndex < 0 || testIndex >= testCases.length) {
      debugTest(`Test at index ${testId} not found for bug ${bugId}`);
      return res.status(404).json({ error: `Test at index ${testId} not found.` });
    }
    
    const { testName, testDescription, passed } = validateResult.value;
    const updateFields = {};
    
    // Build update object for the specific array element
    if (testName) updateFields[`testCases.${testIndex}.testName`] = testName;
    if (testDescription) updateFields[`testCases.${testIndex}.testDescription`] = testDescription;
    if (passed !== undefined) updateFields[`testCases.${testIndex}.passed`] = passed;
    
    // Lab-required audit fields
    updateFields[`testCases.${testIndex}.lastUpdatedOn`] = new Date();
    updateFields[`testCases.${testIndex}.lastUpdatedBy`] = req.user?.email || 'unknown';
    
    // Update the specific test case in the array
    await db.collection('bugs').updateOne(
      { _id: newId(bugId) },
      { $set: updateFields }
    );
    
    debugTest(`Test at index ${testId} updated`);
    
    // Lab-required audit log
    try {
      await saveAuditLog({
        col: 'test',
        op: 'update',
        target: { bugId, testIndex },
        update: updateFields,
        performedBy: req.user?.email || 'unknown'
      });
    } catch {}

    res.status(200).json({ 
      message: `Test at index ${testId} updated!`, 
      testIndex: testIndex 
    });
  } catch (error) {
    debugTest('Error updating test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/bugs/:bugId/testCases/:testId - Delete test case by index
router.delete('/:testId', async (req, res) => {
  try {
    const { bugId, testId } = req.params;
    debugTest(`DELETE /api/bugs/${bugId}/testCases/${testId} called`);
    
    // Validate bugId ObjectId
    if (!isValidId(bugId)) {
      debugTest(`Invalid bugId ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    const db = await connect();
    
    // Check if bug exists
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugTest(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
  
    // Validate testId as array index
    const testIndex = parseInt(testId);
    const testCases = bug.testCases || [];

    if (isNaN(testIndex) || testIndex < 0 || testIndex >= testCases.length) {
      debugTest(`Test at index ${testId} not found for bug ${bugId}`);
      return res.status(404).json({ error: `Test at index ${testId} not found.` });
    }
  
    // Get the test case that will be deleted (for response)
    const deletedTestCase = testCases[testIndex];
    
    // Remove the test case from the array using $unset and $pull
    // First, unset the array element at the specific index
    await db.collection('bugs').updateOne(
      { _id: newId(bugId) },
      { $unset: { [`testCases.${testIndex}`]: 1 } }
    );
    
    // Then pull the null values to compact the array
    await db.collection('bugs').updateOne(
      { _id: newId(bugId) },
      { $pull: { testCases: null } }
    );
    
    debugTest(`Test at index ${testId} deleted from bug ${bugId}`);
    
    // Lab-required audit log
    try {
      await saveAuditLog({
        col: 'test',
        op: 'delete',
        target: { bugId, testIndex },
        performedBy: req.user?.email || 'unknown'
      });
    } catch {}

    res.status(200).json({ 
      message: `Test at index ${testId} deleted!`, 
      deletedTestCase: deletedTestCase
    });
  } catch (error) {
    debugTest('Error deleting test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as TestRouter };