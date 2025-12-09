import express from 'express';
import debug from 'debug';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import { isAuthenticated } from './middleware/isAuthenticated.js';
import { UserRouter } from './routes/api/user.js';
import { BugRouter } from './routes/api/bug.js';
import { CommentRouter } from './routes/api/comment.js';
import { TestRouter } from './routes/api/test.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const debugServer = debug('app:Server');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Always-on request 5xx logger (prints even if DEBUG is not enabled)
app.use((req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode >= 500) {
            console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode}`);
        }
    });
    next();
});

// CORS for frontend and Postman testing
app.use(cors({
    origin: [
        `http://localhost:${process.env.PORT || 8080}`,
        'http://localhost:3000',
        'http://localhost:5173',
    ],
    credentials: true,
}));

// Serve static files from frontend/dist (production build)
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));


app.get('/api/get-session', (req, res) => {
  // return session data or placeholder
  res.json(307, '/api/auth/session');
});

// Help Postman by defaulting Origin in dev (Better Auth requires Origin)
app.use('/api/auth', (req, _res, next) => {
    const isProd = process.env.NODE_ENV === 'production';
    if (!isProd) {
        const origin = req.headers.origin;
        if (!origin || origin === 'null') {
            req.headers.origin = process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 8080}`;
        }
    }
    next();
});

// Public wrappers so anonymous users can register/sign-in via /api/users/*
// These forward to Better Auth and must be defined BEFORE guarding /api/users
app.post('/api/users/sign-up/email', (req, res) => res.redirect(307, '/api/auth/sign-up/email'));
app.post('/api/users/sign-in/email', (req, res) => res.redirect(307, '/api/auth/sign-in/email'));
app.post('/api/users/sign-out', (req, res) => res.redirect(307, '/api/auth/sign-out'));

// Better Auth routes (registration, login, logout, session, etc.)
app.all('/api/auth/*splat', await toNodeHandler(auth));

// Protect all API routes (except /api/auth/*) with authentication
app.use('/api/users', isAuthenticated, UserRouter);
app.use('/api/bugs', isAuthenticated, BugRouter);
app.use('/api/bugs/:bugId/comments', isAuthenticated, CommentRouter);
app.use('/api/bugs/:bugId/testCases', isAuthenticated, TestRouter);
app.use('/api/bugs/:bugId/tests', isAuthenticated, TestRouter);

// 404 handler for API routes (must come BEFORE catch-all)
app.use('/api/*path', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Serve frontend for all non-API routes (SPA routing)
app.get('*path', (req, res) => {
    // Serve index.html for all SPA routes
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Global error handler (Express 5) - logs stack traces to terminal
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    debugServer(`Server is running on port http://localhost:${port}`);
    console.log(`🚀 Frontend available at http://localhost:${port}`);
    console.log(`🔧 API available at http://localhost:${port}/api`);
});

// Process-level safety nets
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});