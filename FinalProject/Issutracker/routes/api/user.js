import express from 'express';
import debugUser from 'debug';

const router = express.Router();
const debugUser = debug('router:userRouter');

router.use(express.urlencoded({ extended: false }));

 const usersArray = []; // Uncomment if using in-memory array

router.get('/list', (req, res) => {
  res.json(usersArray);
  // FIXME: fetch user by ID and send response as JSON
});

router.get('/:userId', (req, res) => {

});

router.post('/register', (req, res) => {

});

router.post('/login', (req, res) => {

});

router.put('/:userId', (req, res) => {
    
});




router.delete('/:userId', (req, res) => {
  // FIXME: delete user and send response as JSON
});

export { router as UserRouter };