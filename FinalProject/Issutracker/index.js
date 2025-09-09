import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';
import { UserRouter } from './routes/api/user.js';
import { BugRouter } from './routes/api/bug.js';



const debugServer = debug('app:Server');

const app = express();

dotenv.config();



app.use(express.urlencoded({ extended: true}));

app.use(express.static('frontend/dist'));

app.use('/api/user', UserRouter);
app.use('/api/bugs',BugRouter);


const port = process.env.PORT || 8080;

app.listen(port,() => {
    console.log(`Server is running on port http://localhost:${port}`);
})

app.get('/', (req, res) => {
    res.send('Hello, world!');
});