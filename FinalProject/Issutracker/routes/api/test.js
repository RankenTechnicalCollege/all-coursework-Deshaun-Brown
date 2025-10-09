import express from 'express';
import debug from 'debug';
import { connect, newId, isValidId } from '../../database.js';
import joi from 'joi';

const debugTest = debug('app:TestRouter');
const router = express.Router({ mergeParams: true }); // mergeParams to access :bugId

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Define Joi schemas
const createTestSchema = joi.object({
  testName: joi.string().min(1).required(),
  testDescription: joi.string().min(1).required(),
  expectedResult: joi.string().min(1).required()
});

const updateTestSchema = joi.object({
  testDescription: joi.string().min(1).optional(),
  passed: joi.boolean().optional(),
  testedBy: joi.string().min(1).optional()
});

// GET /api/bugs/:bugId/tests - Get all test cases for a bug
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
     

// POST /api/bugs/:bugId/tests - Create new test case
router.post('/', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugTest(`POST /api/bugs/${bugId}/tests called`);
    
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
    
    const { testName, testDescription, expectedResult } = validateResult.value;
    
    const db = await connect();
    
    // Check if bug exists
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugTest(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    // Create new test case
    const newTest = {
      bugId: newId(bugId),
      testName: testName,
      testDescription: testDescription,
      expectedResult: expectedResult,
      actualResult: null,
      passed: null,
      testedBy: null,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    const result = await db.collection('tests').insertOne(newTest);
    debugTest(`New test case created with ID: ${result.insertedId}`);
    
    res.status(200).json({ 
      message: "Test case created successfully!", 
      testId: result.insertedId 
    });
  } catch (error) {
    debugTest('Error creating test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/bugs/:bugId/tests/:testId - Update test case
router.patch('/:testId', async (req, res) => {
  try {
    const { bugId, testId } = req.params;
    debugTest(`PATCH /api/bugs/${bugId}/tests/${testId} called`);
    
    // Validate ObjectIds
    if (!isValidId(bugId)) {
      debugTest(`Invalid bugId ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    if (!isValidId(testId)) {
      debugTest(`Invalid testId ObjectId: ${testId}`);
      return res.status(404).json({ error: `testId ${testId} is not a valid ObjectId.` });
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
    
    // Check if test exists
    const test = await db.collection('tests').findOne({ 
      _id: newId(testId), 
      bugId: newId(bugId) 
    });
    if (!test) {
      debugTest(`Test ${testId} not found for bug ${bugId}`);
      return res.status(404).json({ error: `Test ${testId} not found.` });
    }
    
    const { testName, testDescription, expectedResult, actualResult, passed, testedBy } = validateResult.value;
    const updateFields = {};
    
    if (testName) updateFields.testName = testName;
    if (testDescription) updateFields.testDescription = testDescription;
    if (expectedResult) updateFields.expectedResult = expectedResult;
    if (actualResult) updateFields.actualResult = actualResult;
    if (passed !== undefined) updateFields.passed = passed;
    if (testedBy) updateFields.testedBy = testedBy;
    
    updateFields.lastUpdated = new Date();
    
    await db.collection('tests').updateOne(
      { _id: newId(testId), bugId: newId(bugId) },
      { $set: updateFields }
    );
    
    debugTest(`Test ${testId} updated`);
    res.status(200).json({ 
      message: `Test ${testId} updated!`, 
      testId: testId 
    });
  } catch (error) {
    debugTest('Error updating test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/bugs/:bugId/tests/:testId - Delete test case
router.delete('/:testId', async (req, res) => {
  try {
    const { bugId, testId } = req.params;
    debugTest(`DELETE /api/bugs/${bugId}/tests/${testId} called`);
    
    // Validate ObjectIds
    if (!isValidId(bugId)) {
      debugTest(`Invalid bugId ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    if (!isValidId(testId)) {
      debugTest(`Invalid testId ObjectId: ${testId}`);
      return res.status(404).json({ error: `testId ${testId} is not a valid ObjectId.` });
    }
    
    const db = await connect();
    
    // Check if bug exists
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugTest(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    // Check if test exists before deleting
    const test = await db.collection('tests').findOne({ 
      _id: newId(testId), 
      bugId: newId(bugId) 
    });
    if (!test) {
      debugTest(`Test ${testId} not found for bug ${bugId}`);
      return res.status(404).json({ error: `Test ${testId} not found.` });
    }
    
    // Delete the test case
    await db.collection('tests').deleteOne({ 
      _id: newId(testId), 
      bugId: newId(bugId) 
    });
    
    debugTest(`Test ${testId} deleted`);
    res.status(200).json({ 
      message: `Test ${testId} deleted!`, 
      testId: testId 
    });
  } catch (error) {
    debugTest('Error deleting test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as TestRouter };