import debug from "debug";
const debugLog = debug('app:BugRouter');

router.use(express.urlencoded({ extended: false }));

const bugsArray = [];

router.get('/list', (req, res) => {
    const bugId = req.params.bugId;
    //FIXME: get bug from bugsArray and send it as response JSON
});

router.post('/new', (req, res) => {
//FIXME: create new bug and send response as JSON
});

router.put('/:bugId', (req, res) => {
    //FIXME: update  existing bug and send response as JSON
});

router.put('/:bugId/classify', (req, res) => {
    //FIXME: classify existing bug and send response as JSON
});

router.put('/:bugId/assign', (req, res) => {
    //FIXME: assign bug to a user and send response as JSON
});

router.put('/:bugId/close', (req, res) => {
    //FIXME: close bug and send response as JSON
});

export { router as BugRouter };
