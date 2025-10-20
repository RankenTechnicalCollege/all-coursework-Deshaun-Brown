import express from 'express';
import productRouter from './routes/api/products.js';
import debug from 'debug';
import * as dotenv from 'dotenv';

dotenv.config();

// Helpful startup log so we can confirm the file is being executed
console.log('Starting HOT3 server — NODE_ENV=', process.env.NODE_ENV, ' PORT=', process.env.PORT, ' MONGODB_URI=', !!process.env.MONGODB_URI);
const app = express();
app.use(express.json());

const debugServer = debug('app:Server');
// determine port before calling listen
const port = process.env.PORT || 2023;

// single listen call (avoid duplicate binds)
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    debugServer(`Server is running on port http://localhost:${port}`);
});


// Mount according to the assignment path requirement
// Mount router at the assignment-required path
// All product endpoints will be available under /api/products

app.use('/api/products', productRouter);

// health
app.get('/', (req, res) => res.json({ message: 'HOT3 API running' }));

