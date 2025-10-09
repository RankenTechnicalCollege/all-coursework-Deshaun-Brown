import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';
import { UserRouter } from './routes/api/user.js';
import { BugRouter } from './routes/api/bug.js';
import { CommentRouter } from './routes/api/comment.js';
import { TestRouter } from './routes/api/test.js';

const debugServer = debug('app:Server');

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('frontend/dist'));

app.use('/api/users', UserRouter);
app.use('/api/bugs', BugRouter);
app.use('/api/bugs/:bugId/comments', CommentRouter);
app.use('/api/bugs/:bugId/testCases', TestRouter);


const port = process.env.PORT || 8080;

app.listen(port,() => {
    debugServer(`Server is running on port http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
});