import express from 'express';
import debug from 'debug';
import { connect, newId, isValidId } from '../../database.js';
import joi from 'joi';


const debugComment = debug('app:CommentRouter');
const router = express.Router({ mergeParams: true }); // mergeParams to access :bugId

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Define Joi schemas
const createCommentSchema = joi.object({
  comment: joi.string().min(1).required(),
  operationAuthor: joi.string().min(1).required(),
  text: joi.string().min(1).optional()
});

// GET /api/bugs/:bugId/comments - Get all comments for a bug
router.get('/', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugComment(`GET /api/bugs/${bugId}/comments called`);
    
    // Validate bugId
    if (!isValidId(bugId)) {
      debugComment(`Invalid ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    const db = await connect();
    
    // Get bug with its comments
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugComment(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    // Return the comments array (or empty array if no comments)
    const comments = bug.comments || [];
    debugComment(`Found ${comments.length} comments for bug ${bugId}`);
    
    res.json(comments);
  } catch (error) {
    debugComment('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bugs/:bugId/comments/:commentId - Get specific comment
router.get('/:commentId', async (req, res) => {
  try {
    const { bugId, commentId } = req.params;
    debugComment(`GET /api/bugs/${bugId}/comments/${commentId} called`);
    
    // Validate bugId ObjectId
    if (!isValidId(bugId)) {
      debugComment(`Invalid bugId ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    const db = await connect();
    
    // Get bug with its comments
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugComment(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    // Find comment by index (commentId as array index)
    const comments = bug.comments || [];
    const commentIndex = parseInt(commentId);
    
    if (isNaN(commentIndex) || commentIndex < 0 || commentIndex >= comments.length) {
      debugComment(`Comment ${commentId} not found for bug ${bugId}`);
      return res.status(404).json({ error: `Comment ${commentId} not found.` });
    }
    
    const comment = comments[commentIndex];
    debugComment(`Comment ${commentId} found`);
    res.json(comment);
  } catch (error) {
    debugComment('Error fetching comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/bugs/:bugId/comments - Create new comment
router.post('/', async (req, res) => {
  try {
    const { bugId } = req.params;
    debugComment(`POST /api/bugs/${bugId}/comments called`);
    
    // Validate bugId
    if (!isValidId(bugId)) {
      debugComment(`Invalid ObjectId: ${bugId}`);
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }
    
    // Validate request body with Joi
    const validateResult = createCommentSchema.validate(req.body);
    if (validateResult.error) {
      debugComment(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error });
    }

    const { comment, operationAuthor, text } = validateResult.value;

    const db = await connect();
    
    // Check if bug exists
    const bug = await db.collection('bugs').findOne({ _id: newId(bugId) });
    if (!bug) {
      debugComment(`Bug ${bugId} not found`);
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }
    
    // Create new comment object
    const newComment = {
      comment,
      operationAuthor,
      dateTime: new Date().toISOString(),
      text: text || "",
      createdBy: req.user?.email || 'unknown'
    };
    
    // Add comment to the bug's comments array
    await db.collection('bugs').updateOne(
      { _id: newId(bugId) },
      { $push: { comments: newComment } }
    );
    
    debugComment(`New comment added to bug ${bugId}`);
    
    res.status(200).json({ 
      message: "Comment added successfully!", 
      comment: newComment
    });
  } catch (error) {
    debugComment('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as CommentRouter };