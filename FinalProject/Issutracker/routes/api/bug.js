import express from 'express';
import debug from "debug";
const debugLog = debug('app:BugRouter');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));

const bugsArray = [
    {
        id: 'b1',
        title: "Can't login",
        description: 'User cannot login with correct credentials.',
        stepsToReproduce: '1. Go to login page\n2. Enter valid credentials\n3. Click login',
        createdAt: '2025-09-01T13:00:00.000Z',
        classification: 'Authentication',
        assignedToUserId: 'u1',
        assignedToUserName: 'Alice Smith',
        closed: false
    },
    {
        id: 'b2',
        title: 'Page crashes',
        description: 'The dashboard page crashes on load.',
        stepsToReproduce: '1. Login\n2. Go to dashboard',
        createdAt: '2025-09-02T14:00:00.000Z',
        classification: 'UI',
        assignedToUserId: 'u2',
        assignedToUserName: 'Bob Johnson',
        closed: false
    },
    {
        id: 'b3',
        title: 'Typo in footer',
        description: 'There is a typo in the footer text.',
        stepsToReproduce: '1. Scroll to bottom of any page',
        createdAt: '2025-09-03T15:00:00.000Z',
        classification: 'Content',
        assignedToUserId: 'u3',
        assignedToUserName: 'Carol Williams',
        closed: true,
        closedOn: '2025-09-04T10:00:00.000Z'
    }
];


// GET /api/bug/list - Return all bugs as JSON array
router.get('/list', (req, res) => {
    debugLog('GET /api/bug/list called');
    res.json(bugsArray);
});

// GET /api/bug/:bugId - Return a specific bug by ID
router.get('/:bugId', (req, res) => {
    const { bugId } = req.params;
    debugLog(`GET /api/bug/${bugId} called`);
    const bug = bugsArray.find(b => String(b.id) === String(bugId));
    if (bug) {
        res.json(bug);
    } else {
        res.status(404).type('text/plain').send(`Bug ${bugId} not found.`);
    }
});


import { nanoid } from 'nanoid';

// POST /api/bug/new - Create a new bug
router.post('/new', (req, res) => {
    debugLog('POST /api/bug/new called');
    const { title, description, stepsToReproduce } = req.body;
    let invalid = [];
    if (!title || typeof title !== 'string' || !title.trim()) invalid.push('title');
    if (!description || typeof description !== 'string' || !description.trim()) invalid.push('description');
    if (!stepsToReproduce || typeof stepsToReproduce !== 'string' || !stepsToReproduce.trim()) invalid.push('stepsToReproduce');
    if (invalid.length > 0) {
        debugLog(`Invalid fields: ${invalid.join(', ')}`);
        return res.status(400).type('text/plain').send(`Invalid or missing: ${invalid.join(', ')}`);
    }
    const newBug = {
        id: nanoid(),
        title: title.trim(),
        description: description.trim(),
        stepsToReproduce: stepsToReproduce.trim(),
        createdAt: new Date().toISOString()
    };
    bugsArray.push(newBug);
    debugLog(`New bug created: ${newBug.id}`);
    res.status(200).type('text/plain').send('New bug reported!');
});


// PUT /api/bug/:bugId - Update an existing bug's data
router.put('/:bugId', (req, res) => {
    const { bugId } = req.params;
    debugLog(`PUT /api/bug/${bugId} called`);
    const bug = bugsArray.find(b => String(b.id) === String(bugId));
    if (!bug) {
        debugLog(`Bug ${bugId} not found for update`);
        return res.status(404).type('text/plain').send(`Bug ${bugId} not found.`);
    }
    const { title, description, stepsToReproduce } = req.body;
    if (title && typeof title === 'string' && title.trim()) bug.title = title.trim();
    if (description && typeof description === 'string' && description.trim()) bug.description = description.trim();
    if (stepsToReproduce && typeof stepsToReproduce === 'string' && stepsToReproduce.trim()) bug.stepsToReproduce = stepsToReproduce.trim();
    bug.lastUpdated = new Date().toISOString();
    debugLog(`Bug ${bugId} updated`);
    res.status(200).type('text/plain').send('Bug updated!');
});


// PUT /api/bug/:bugId/classify - Update bug classification
router.put('/:bugId/classify', (req, res) => {
    const { bugId } = req.params;
    debugLog(`PUT /api/bug/${bugId}/classify called`);  
    const { classification } = req.body;
    if (!classification || typeof classification !== 'string' || !classification.trim()) {
        debugLog('Invalid or missing classification');
        return res.status(400).type('text/plain').send('Invalid or missing: classification');
    }
    const bug = bugsArray.find(b => String(b.id) === String(bugId));
    if (!bug) {
        debugLog(`Bug ${bugId} not found for classify`);
        return res.status(404).type('text/plain').send(`Bug ${bugId} not found.`);
    }
    bug.classification = classification.trim();
    bug.classifiedOn = new Date().toISOString();
    bug.lastUpdated = new Date().toISOString();
    debugLog(`Bug ${bugId} classified as ${bug.classification}`);
    res.status(200).type('text/plain').send('Bug classified!');
});


// PUT /api/bug/:bugId/assign - Assign bug to a user
router.put('/:bugId/assign', (req, res) => {
    const { bugId } = req.params;
    debugLog(`PUT /api/bug/${bugId}/assign called`);
    const { assignedToUserId, assignedToUserName } = req.body;
    let invalid = [];
    if (!assignedToUserId || typeof assignedToUserId !== 'string' || !assignedToUserId.trim()) invalid.push('assignedToUserId');
    if (!assignedToUserName || typeof assignedToUserName !== 'string' || !assignedToUserName.trim()) invalid.push('assignedToUserName');
    if (invalid.length > 0) {
        debugLog(`Invalid fields: ${invalid.join(', ')}`);
        return res.status(400).type('text/plain').send(`Invalid or missing: ${invalid.join(', ')}`);
    }
    const bug = bugsArray.find(b => String(b.id) === String(bugId));
    if (!bug) {
        debugLog(`Bug ${bugId} not found for assign`);
        return res.status(404).type('text/plain').send(`Bug ${bugId} not found.`);
    }
    bug.assignedToUserId = assignedToUserId.trim();
    bug.assignedToUserName = assignedToUserName.trim();
    bug.assignedOn = new Date().toISOString();
    bug.lastUpdated = new Date().toISOString();
    debugLog(`Bug ${bugId} assigned to ${bug.assignedToUserName}`);
    res.status(200).type('text/plain').send('Bug assigned!');
});


// PUT /api/bug/:bugId/close - Close a bug
router.put('/:bugId/close', (req, res) => {
    const { bugId } = req.params;
    debugLog(`PUT /api/bug/${bugId}/close called`);
    const { closed } = req.body;
    if (typeof closed === 'undefined' || typeof closed !== 'boolean') {
        debugLog('Invalid or missing closed');
        return res.status(400).type('text/plain').send('Invalid or missing: closed');
    }
    const bug = bugsArray.find(b => String(b.id) === String(bugId));
    if (!bug) {
        debugLog(`Bug ${bugId} not found for close`);
        return res.status(404).type('text/plain').send(`Bug ${bugId} not found.`);
    }
    bug.closed = closed;
    bug.closedOn = new Date().toISOString();
    bug.lastUpdated = new Date().toISOString();
    debugLog(`Bug ${bugId} closed: ${closed}`);
    res.status(200).type('text/plain').send('Bug closed!');
});

export { router as BugRouter };
