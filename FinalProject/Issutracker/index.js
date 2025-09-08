import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';

const debugServer = debug('app:Server');

const app = express();

dotenv.config();



app.use(express.urlencoded({ extended: true}));

app.use(express.static('frontend/dist'));

const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(`Server is running on port http://localhost:${port}`);
})

app.get('/', (req, res) => {
    res.send('Hello, world!');
});