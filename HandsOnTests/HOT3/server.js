
import express from 'express';
import productRouter from './routes/api/products.js';
import { ping } from './database.js';
import debug from 'debug';




// Helpful startup log so we can confirm the file is being executed
console.log(
  'Starting HOT3 server —',
  'PORT=', process.env.PORT,
  'DB_URL=', process.env.DB_URL,
  'DB_NAME=', process.env.DB_NAME
);
// create express app
const app = express();

app.use(express.json());

// Request logging middleware so incoming requests appear in the terminal
app.use((req, res, next) => {
    const now = new Date().toISOString();
    const bodyPreview = req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : '';
    console.log(`[${now}] ${req.ip} ${req.method} ${req.originalUrl} ${bodyPreview}`);
    next();
});

const debugServer = debug('app:Server');
// determine port before calling listen
const port = process.env.PORT || 2023;

// single listen call (avoid duplicate binds)
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    debugServer(`Server is running on port http://localhost:${port}`);
});



app.get('/api/ping', async (req, res) => {
  try {
    await ping();
    res.json({ message: 'MongoDB connection successful' });
  } catch (err) {
    res.status(500).json({ message: 'MongoDB connection failed', error: err.message });
  }
});

// Mount according to the assignment path requirement
// Mount router at the assignment-required path
// All product endpoints will be available under /api/products

app.use('/api/products', productRouter);

// health
app.get('/', (req, res) => res.json({ message: 'HOT3 API running' }));

