import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import productRouter from './routes/api/products.js';
import userRouter from './routes/api/users.js';
import { auth } from './auth.js';
import { ping } from './database.js';
import debug from 'debug';


const debugServer = debug('app:Server');

// Helpful startup log so we can confirm the file is being executed
debugServer(
  'Starting HOT3 server —',
  'PORT=', process.env.PORT,
  'DB_URL=', process.env.DB_URL,
  'DB_NAME=', process.env.DB_NAME
);
// create express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware so incoming requests appear in the terminal
app.use((req, res, next) => {
    const now = new Date().toISOString();
    const bodyPreview = req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : '';
    console.log(`[${now}] ${req.ip} ${req.method} ${req.originalUrl} ${bodyPreview}`);
    next();
});


// determine port before calling listen
const port = process.env.PORT || 2023;

// single listen call (avoid duplicate binds)
app.listen(port, () => {
    debugServer(`Server listening on port ${port}`);
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

// Handle all auth routes through Better Auth's handler
// This includes:
// - POST /api/auth/sign-up/email
// - POST /api/auth/sign-in/email
// - POST /api/auth/sign-out
// - GET /api/auth/get-session
app.all('/api/auth/*splat', await toNodeHandler(auth));

// Mount API routes
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

app.use(express.static('Ecommerce/dist'));

// Simple root route (optional; Issuetracker sends a greeting)
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

