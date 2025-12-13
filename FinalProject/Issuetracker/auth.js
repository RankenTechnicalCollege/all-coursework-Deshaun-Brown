import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getClient, getDatabase } from "./database.js";
import debug from "debug";

const debugAuth = debug('app:Auth');
const client = await getClient();
const db = await getDatabase();

export const auth = betterAuth({
baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 8080}/api/auth`,
  trustedOrigins: [
    `http://localhost:${process.env.PORT || 8080}`,
    "http://localhost:3000",
    "http://localhost:5173",
    "https://issuetracker-service-293672483239.us-central1.run.app",
  ],
  secret: process.env.BETTER_AUTH_SECRET || "44d896c6e63c1875bc292138f4f53fd4b383d02c58530ced574b1f3d86901112",
  // Use pluralized collection names (users, sessions, etc.) so they match the rest of the app
  database: mongodbAdapter(db, { client, usePlural: true }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 300, // 5 minutes
    cookieCache: {
      enabled: true, // Enable caching session in cookie (default: `false`)    
      maxAge: 300 // 5 minutes
    },
    cookie: {
    sameSite: "lax",
    secure: false, // true only in HTTPS prod
  },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "DEV",
      },
      fullName: {
        type: "string",
        required: false,
      },
    },
  },
  hooks: {
    // Hook called after user is created
    async afterUserCreate({ user }) {
      debugAuth('afterUserCreate hook called for user:', user.email);
      // The role should be passed in the request body and Better Auth will handle it
      // But we can also update the user document here if needed
      return user;
    },
  },
});

export default auth;
