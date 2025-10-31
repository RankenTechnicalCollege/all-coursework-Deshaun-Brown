import express from 'express';
import debug from 'debug';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import { isAuthenticated } from './middleware/isAuthenticated.js';
import { UserRouter } from './routes/api/user.js';
import { BugRouter } from './routes/api/bug.js';
import { CommentRouter } from './routes/api/comment.js';
import { TestRouter } from './routes/api/test.js';

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

app.use(express.static('frontend/dist'));

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
// Lab expects /tests path; mount alias
app.use('/api/bugs/:bugId/tests', isAuthenticated, TestRouter);


const port = process.env.PORT || 8080;

app.listen(port,() => {
    debugServer(`Server is running on port http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Global error handler (Express 5) - logs stack traces to terminal
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ error: 'Internal server error' });
});

// Process-level safety nets
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});