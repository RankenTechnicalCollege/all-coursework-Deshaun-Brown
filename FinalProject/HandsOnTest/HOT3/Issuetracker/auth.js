import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getClient, getDatabase } from "./database.js";
import debug from "debug";

const debugAuth = debug('app:Auth');
let authInstance = null;

export async function auth() {
  if (authInstance) return authInstance;

  const client = await getClient();
  const db = await getDatabase();

  authInstance = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 8080}/api/auth`,
    trustedOrigins: [
      `http://localhost:${process.env.PORT || 8080}`,
      "http://localhost:3000",
      "http://localhost:5173",
      "https://issuetracker-service-293672483239.us-central1.run.app",
    ],
    secret: process.env.BETTER_AUTH_SECRET || "44d896c6e63c1875bc292138f4f53fd4b383d02c58530ced574b1f3d86901112",
    database: mongodbAdapter(db, { client, usePlural: true }),
    emailAndPassword: { enabled: true },
    session: {
      expiresIn: 300,
      cookieCache: { enabled: true, maxAge: 300 },
      cookie: { sameSite: "lax", secure: false, httpOnly: true, path: "/" },
    },
    user: {
      additionalFields: {
        role: { type: "string", required: false, defaultValue: "DEV" },
        fullName: { type: "string", required: false },
      },
    },
    hooks: {
      async afterUserCreate({ user }) {
        debugAuth('afterUserCreate hook called for user:', user.email);
        return user;
      },
    },
  });

  return authInstance;
}

export default auth;
