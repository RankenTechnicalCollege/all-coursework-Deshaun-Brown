import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { getClient, getDatabase } from './database.js';

const client = await getClient();
const db = await getDatabase();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 2023}`,
  trustedOrigins: [
    `http://localhost:${process.env.PORT || 2023}`,
    'http://localhost:5173'
  ],
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-change-me',
database: mongodbAdapter(db, { client, usePlural: true }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: true,
    maxAge: 60 * 60, // 1 hour in seconds
  },
  users: {
    additionalFields: {
      name: { type: 'string', required: true },
      role: { type: 'string', required: false },
      lastUpdatedOn: { type: 'date', required: false }
    },
  },
});